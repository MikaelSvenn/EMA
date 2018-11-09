import { http, redis, pingTimes } from '../integrationtest';

describe('Request filter', () => {
  afterEach(() => {
    redis.flushall();
  });

  it('should be able to block trace with blocked clients', async () => {
    await pingTimes(21, 'foobar');
    const lastResult = await pingTimes(4);
    expect(lastResult.status).toEqual(404);
  });
});

export default (testFixture) => {
  describe('Request filter', () => {
    afterAll(() => {
      redis.flushall();
    });

    const expectRequestNotProcessed = async (options) => {
      const lastResult = await http()
        .post('/message')
        .set('user-agent', options.userAgent)
        .send({
          message: 'foo',
        });

      expect(lastResult.status).toEqual(404);

      const messageKeys = await redis.keysAsync('message*');
      expect(messageKeys.length).toEqual(0);
    };

    testFixture(expectRequestNotProcessed);
  });
};
