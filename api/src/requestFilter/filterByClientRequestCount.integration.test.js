import { http, redis, pingTimes } from '../integrationtest';
import requestFilterTest from './requestFilter.integration.test';

requestFilterTest((expectRequestNotProcessed) => {
  describe('by request count from a single user agent should', () => {
    let lastResult;

    afterEach(() => {
      redis.flushall();
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
      await expectRequestNotProcessed({ userAgent: 'foobar' });
    });

    it('not block the whole trace when a given user agent is blocked', async () => {
      await pingTimes(21, 'foobar');
      lastResult = await http()
        .get('/ping')
        .set('user-agent', 'foobarbaz');

      expect(lastResult.status).toEqual(200);
    });
  });
});
