/* eslint no-await-in-loop: 0 */
/* eslint no-param-reassign: 0 */

import { http, redis } from '../integrationtest';

describe('Request filter', () => {
  let lastResult;

  afterAll(() => {
    redis.flushall();
  });

  const pingTimes = async (amountOfCalls, userAgent) => {
    while (amountOfCalls > 0) {
      const givenUserAgent = userAgent || amountOfCalls;
      lastResult = await http()
        .get('/ping')
        .set('user-agent', givenUserAgent);

      amountOfCalls -= 1;
    }
  };

  const expectRequestToFailAndNotPersistChanges = async (options) => {
    lastResult = await http()
      .post('/message')
      .set('user-agent', options.userAgent)
      .send({
        message: 'foo',
      });

    expect(lastResult.status).toEqual(404);

    const messageKeys = await redis.keysAsync('message*');
    expect(messageKeys.length).toEqual(0);
  };

  describe('by user agent count from a singe IP address should', () => {
    afterEach(() => {
      redis.flushall();
    });

    afterEach(() => {
      lastResult = undefined;
    });

    it('not block the given IP when less than 5 unique user agents are identified', async () => {
      await pingTimes(4);
      expect(lastResult.status).toEqual(200);
    });

    it('block the given IP address when fifth unique user agent is identified', async () => {
      await pingTimes(4);
      lastResult = await http()
        .get('/ping')
        .set('user-agent', '5');
      expect(lastResult.status).toEqual(404);
    });

    it('prevent any furhter requests from the blocked IP', async () => {
      await pingTimes(5);
      lastResult = await http()
        .get('/ping')
        .set('user-agent', '1');

      expect(lastResult.status).toEqual(404);
    });

    it('not process requests from the blocked IP', async () => {
      await pingTimes(5);
      await expectRequestToFailAndNotPersistChanges({ userAgent: 'foo' });
    });
  });

  describe('by request count from a single user agent should', () => {
    afterEach(() => {
      redis.flushall();
    });

    afterEach(() => {
      lastResult = undefined;
    });

    it('not block the given user agent when less than 21 requests are received', async () => {
      await pingTimes(19, 'foobar');
      lastResult = await http()
        .get('/ping')
        .set('user-agent', 'foobar');

      expect(lastResult.status).toEqual(200);
    });

    it('block the given user agent when over 20 requests are received', async () => {
      await pingTimes(20, 'foobar');
      lastResult = await http()
        .get('/ping')
        .set('user-agent', 'foobar');

      expect(lastResult.status).toEqual(404);
    });

    it('prevent further requests from the blocked user agent', async () => {
      await pingTimes(21, 'foobar');
      lastResult = await http()
        .get('/ping')
        .set('user-agent', 'foobar');

      expect(lastResult.status).toEqual(404);
    });

    it('not process requests from the blocked user agent', async () => {
      await pingTimes(21, 'foobar');
      await expectRequestToFailAndNotPersistChanges({ userAgent: 'foobar' });
    });

    it('not block the whole trace when a given user agent is blocked', async () => {
      await pingTimes(21, 'foobar');
      lastResult = await http()
        .get('/ping')
        .set('user-agent', 'foobarbaz');

      expect(lastResult.status).toEqual(200);
    });
  });

  it('should block trace with blocked clients', async () => {
    await pingTimes(21, 'foobar');
    await pingTimes(4);
    expect(lastResult.status).toEqual(404);
  });
});
