import { http, redis, pingTimes } from '../integrationtest';
import requestFilterTest from './requestFilterTestBase';

requestFilterTest((expectRequestNotProcessed) => {
  describe('by user agent count from a singe IP address should', () => {
    let lastResult;

    afterEach(() => {
      redis.flushall();
      lastResult = undefined;
    });

    it('not block the given IP when less than 5 unique user agents are identified', async () => {
      lastResult = await pingTimes(4);
      expect(lastResult.status).toEqual(200);
    });

    it('block the given IP address when fifth unique user agent is identified', async () => {
      await pingTimes(4);
      lastResult = await http()
        .get('/ping')
        .set('user-agent', { userAgent: '5' });
      expect(lastResult.status).toEqual(404);
    });

    it('prevent any furhter requests from the blocked IP', async () => {
      await pingTimes(5);
      lastResult = await http()
        .get('/ping')
        .set('user-agent', { userAgent: '1' });

      expect(lastResult.status).toEqual(404);
    });

    it('not process requests from the blocked IP', async () => {
      await pingTimes(5);
      await expectRequestNotProcessed({ userAgent: 'foo' });
    });
  });
});
