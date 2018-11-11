import { http, redis, pingTimes } from '../integrationtest';
import requestFilterTest from './requestFilterTestBase';

requestFilterTest((expectRequestNotProcessed) => {
  describe('by request count from a single user agent should', () => {
    let lastResult;

    afterEach(() => {
      redis.flushall();
      lastResult = undefined;
    });

    it('not block the given user agent when less than 21 requests are received', async () => {
      lastResult = await pingTimes(20, { userAgent: 'foobar' });
      expect(lastResult.status).toEqual(200);
    }, 10000);

    it('block the given user agent when over 20 requests are received', async () => {
      lastResult = await pingTimes(21, { userAgent: 'foobar' });
      expect(lastResult.status).toEqual(404);
    }, 10000);

    it('prevent further requests from the blocked user agent', async () => {
      await pingTimes(21, { userAgent: 'foobar' });
      lastResult = await http()
        .get('/ping')
        .set('user-agent', 'foobar');

      expect(lastResult.status).toEqual(404);
    }, 10000);

    it('not process requests from the blocked user agent', async () => {
      await pingTimes(21, { userAgent: 'foobar' });
      await expectRequestNotProcessed({ userAgent: 'foobar' });
    }, 10000);

    it('not block the whole trace when a given user agent is blocked', async () => {
      await pingTimes(21, { userAgent: 'foobar' });
      lastResult = await http()
        .get('/ping')
        .set('user-agent', 'foobarbaz');

      expect(lastResult.status).toEqual(200);
    }, 10000);
  });
});
