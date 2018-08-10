/* eslint no-await-in-loop: 0 */
import responseTime from 'superagent-response-time';
import { http, redis } from '../integrationtest';

describe('GET /ping', () => {
  afterAll(() => {
    redis.flushall();
  });

  it('should return http 200', () => http()
    .get('/ping')
    .expect(200));

  it('should return client ip address', () => http()
    .get('/ping')
    .expect('::ffff:127.0.0.1'));

  it('should return content of x-forwarded-for when present', () => http()
    .get('/ping')
    .set('x-forwarded-for', 'foobar')
    .expect('foobar'));

  it('should execute subsequent requests with delay difference of over 80ms', async () => {
    const responseTimes = [];
    while (responseTimes.length < 10) {
      await http().get('/ping').use(responseTime((_, time) => {
        responseTimes.push(time);
      }));
    }
    const shortestExecutionTime = Math.min(...responseTimes);
    const longestExecutionTime = Math.max(...responseTimes);

    expect(longestExecutionTime - shortestExecutionTime).toBeGreaterThanOrEqual(80);
  });
});
