import { http, redis } from '../integrationtest';

describe('Request filter', () => {
  describe('by user agent from a singe IP address', () => {
    let result;

    afterAll(() => {
      redis.flushall();
    });

    it('should not block the given IP when less than 5 unique user agents are identified', async () => {
      await http()
        .get('/ping')
        .set('user-agent', '1');
      await http()
        .get('/ping')
        .set('user-agent', '2');
      await http()
        .get('/ping')
        .set('user-agent', '3');
      result = await http()
        .get('/ping')
        .set('user-agent', '4');

      expect(result.status).toEqual(200);
    });

    it('should block the given IP address when fifth unique user agent is identified', async () => {
      result = await http()
        .get('/ping')
        .set('user-agent', '5');
      expect(result.status).toEqual(404);
    });

    it('should prevent any furhter requests from the blocked IP', async () => {
      result = await http()
        .get('/ping')
        .set('user-agent', '1');

      expect(result.status).toEqual(404);
    });

    it('should not process requests from the blocked IP', async () => {
      result = await http()
        .post('/message')
        .set('user-agent', '2')
        .send({
          message: 'foo',
        });

      expect(result.status).toEqual(404);

      const messageKeys = await redis.keysAsync('message*');
      expect(messageKeys.length).toEqual(0);
    });
  });
});
