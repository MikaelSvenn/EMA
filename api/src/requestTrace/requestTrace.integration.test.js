/* eslint prefer-destructuring: 0 */

import { http, redis } from '../integrationtest';

describe('Request trace', () => {
  let currentTime;
  let initialTraceKey;
  let initialTrace;
  let updatedTrace;

  beforeAll(async () => {
    currentTime = Date.now();
    await http()
      .get('/ping')
      .set('user-agent', 'foobar');

    const traceKeys = await redis.keysAsync('trace*');
    initialTraceKey = traceKeys[0];
    initialTrace = await redis.getAsync(initialTraceKey);
    initialTrace = JSON.parse(initialTrace);
  });

  afterAll(() => {
    redis.flushall();
  });

  describe('should create new trace with', () => {
    it('type', () => {
      expect(initialTrace.type).toEqual('trace');
    });

    it('timestamp', () => {
      const elapsedMilliseconds = initialTrace.value.createdOn - currentTime;
      expect(elapsedMilliseconds).toBeLessThan(500);
    });

    it('requestCount', () => {
      expect(initialTrace.value.requestCount).toEqual(1);
    });

    it('requestsReceivedOn', () => {
      expect(initialTrace.value.requestsReceivedOn).toEqual([
        initialTrace.value.createdOn,
      ]);
    });

    it('isBlocked', () => {
      expect(initialTrace.value.isBlocked).toEqual(false);
    });

    it('errors', () => {
      expect(initialTrace.value.errors).toEqual([]);
    });

    it('signature', () => {
      expect(initialTrace.value.signature.length).toEqual(64);
    });

    it('expiry time of 600 seconds', async () => {
      const expiration = await redis.pttlAsync(initialTraceKey);
      expect(expiration).toBeGreaterThan(599500);
      expect(expiration).toBeLessThan(600000);
    });

    describe('containing client with', () => {
      let client;

      beforeAll(() => {
        client = initialTrace.value.clients[Object.keys(initialTrace.value.clients)[0]];
      });

      it('requestsReceivedOn', () => {
        expect(client.requestsReceivedOn).toEqual([
          initialTrace.value.createdOn,
        ]);
      });

      it('requestCount', () => {
        expect(client.requestCount).toEqual(1);
      });

      it('isBlocked', () => {
        expect(client.isBlocked).toEqual(false);
      });

      it('errors', () => {
        expect(client.errors).toEqual([]);
      });
    });
  });

  describe('should update previous trace on subsequent requests with', () => {
    let updateTime;

    beforeAll(async () => {
      updateTime = Date.now();
      await http()
        .get('/ping')
        .set('user-agent', 'foobar');

      await http()
        .get('/ping')
        .set('user-agent', 'barfoo');

      updatedTrace = await redis.getAsync(initialTraceKey);
      updatedTrace = JSON.parse(updatedTrace);
    });

    it('requestCount', () => {
      expect(updatedTrace.value.requestCount).toEqual(3);
    });

    it('requestsReceivedOn', () => {
      expect(updatedTrace.value.requestsReceivedOn.length).toEqual(3);
      const requestsWithoutInitial = updatedTrace.value.requestsReceivedOn.filter(timestamp => timestamp > initialTrace.value.createdOn);
      expect(requestsWithoutInitial.length).toEqual(2);
    });

    it('signature', () => {
      expect(updatedTrace.value.signature.length).toEqual(64);
      expect(updatedTrace.value.signature).not.toEqual(initialTrace.value.signature);
    });

    it('refreshed expiration of 600 seconds', async () => {
      await new Promise(resolve => setTimeout(resolve, 501));
      await http()
        .get('/ping')
        .set('user-agent', 'bazbaz');

      const expiration = await redis.pttlAsync(initialTraceKey);
      expect(expiration).toBeGreaterThan(599500);
    });

    describe('new client when request originates from a new client', () => {
      let client;

      beforeAll(() => {
        client = updatedTrace.value.clients[Object.keys(updatedTrace.value.clients)[1]];
      });

      it('requestsReceivedOn', () => {
        expect(client.requestsReceivedOn).toEqual([
          updatedTrace.value.requestsReceivedOn[2],
        ]);
      });

      it('requestCount', () => {
        expect(client.requestCount).toEqual(1);
      });

      it('isBlocked', () => {
        expect(client.isBlocked).toEqual(false);
      });

      it('errors', () => {
        expect(client.errors).toEqual([]);
      });
    });

    describe('updated client when request originates from a previous client', () => {
      let client;

      beforeAll(() => {
        client = updatedTrace.value.clients[Object.keys(updatedTrace.value.clients)[0]];
      });

      it('requestCount', () => {
        expect(client.requestCount).toEqual(2);
      });

      it('requestsReceivedOn', () => {
        expect(client.requestsReceivedOn.length).toEqual(2);
        expect(client.requestsReceivedOn[1]).toBeGreaterThan(client.requestsReceivedOn[0]);
        const elapsedMilliseconds = client.requestsReceivedOn[1] - updateTime;
        expect(elapsedMilliseconds).toBeLessThan(500);
      });
    });
  });

  it('should be applied to all routes', async () => {
    const previousSignature = updatedTrace.value.signature;
    await http()
      .post('/message')
      .set('user-agent', 'baz')
      .send({
        message: 'test',
      });

    updatedTrace = await redis.getAsync(initialTraceKey);
    updatedTrace = JSON.parse(updatedTrace);

    expect(updatedTrace.value.requestsReceivedOn.length).toEqual(5);
    expect(updatedTrace.value.signature).not.toEqual(previousSignature);
  });

  describe('when trace content is tampered with', () => {
    let trace;

    beforeAll(async () => {
      trace = await redis.getAsync(initialTraceKey);
      trace = JSON.parse(trace);

      trace.value.isBlocked = true;
      await redis.setAsync([initialTraceKey, JSON.stringify(trace), 'EX', 600]);
    });

    it('should return 404', async () => {
      const result = await http().get('/ping').set('user-agent', 'foobar');
      expect(result.status).toEqual(404);
    });

    it('should not update the given trace', async () => {
      await http().get('/ping').set('user-agent', 'foobar');
      await http().get('/ping').set('user-agent', 'foobar');
      await http().get('/ping').set('user-agent', 'foobar');

      trace = await redis.getAsync(initialTraceKey);
      trace = JSON.parse(trace);

      expect(trace.value.requestsReceivedOn).toEqual(updatedTrace.value.requestsReceivedOn);
      expect(trace.value.clients).toEqual(updatedTrace.value.clients);
      expect(trace.value.signature).toEqual(updatedTrace.value.signature);
    });
  });

  it('should create new trace for each unique client endpoint', async () => {
    await redis.flushallAsync();
    await http()
      .get('/ping')
      .set('x-forwarded-for', '192.168.1.1')
      .set('user-agent', 'foobar');

    await http()
      .get('/ping')
      .set('x-FORwarded-for', '192.168.1.2')
      .set('user-agent', 'foobar');

    await http()
      .get('/ping')
      .set('X-Forwarded-For', '192.168.1.3')
      .set('user-agent', 'foobar');

    await http()
      .get('/ping')
      .set('X-FORWARDED-FOR', '192.168.1.4')
      .set('user-agent', 'foobar');

    await http()
      .get('/ping')
      .set('X-Forwarded-For', '192.168.1.4, 192.168.1.1')
      .set('user-agent', 'foobar');

    const traceKeys = await redis.keysAsync('trace*');
    expect(traceKeys.length).toEqual(4);
  });
});
