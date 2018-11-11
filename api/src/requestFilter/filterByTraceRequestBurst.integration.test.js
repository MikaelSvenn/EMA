import { http, redis, pingTimes, delay } from '../integrationtest';
import requestFilterTest from './requestFilterTestBase';

requestFilterTest((expectRequestNotProcessed) => {
  describe('by request burst from a singe IP address should', () => {
    let lastResult;
    let requestOptions;

    beforeEach(() => {
      requestOptions = {
        userAgent: 'foobar',
        http: {
          avoidTraceBurst: false,
        },
      };
    });

    afterEach(() => {
      redis.flushall();
      lastResult = undefined;
    });

    it('not block the given IP when less than 6 requests are submitted within 1 second', async () => {
      lastResult = await pingTimes(5, requestOptions);
      expect(lastResult.status).toEqual(200);
    });

    it('not block the given IP when 6 requests are submitted in over 1 second', async () => {
      lastResult = await pingTimes(5, requestOptions);
      await delay(1010);
      lastResult = await pingTimes(1, requestOptions);
      expect(lastResult.status).toEqual(200);
    });

    it('block the given IP address when 6th request is submitted within 1 second', async () => {
      lastResult = await pingTimes(6, requestOptions);
      expect(lastResult.status).toEqual(404);
    });

    it('prevent any furhter requests from the blocked IP', async () => {
      await pingTimes(6, requestOptions);
      lastResult = await http()
        .get('/ping')
        .set('user-agent', 'bar');

      expect(lastResult.status).toEqual(404);
    });

    it('not process requests from the blocked IP', async () => {
      await pingTimes(5, requestOptions);
      await expectRequestNotProcessed(requestOptions);
    });
  });
});
