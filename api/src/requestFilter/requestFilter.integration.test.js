import { redis, pingTimes } from '../integrationtest';

describe('Request filter', () => {
  afterEach(() => {
    redis.flushall();
  });

  it('should be able to block trace with blocked clients', async () => {
    await pingTimes(21, { userAgent: 'baz' });
    const lastResult = await pingTimes(4);
    expect(lastResult.status).toEqual(404);
  }, 10000);
});
