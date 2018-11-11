import { http, redis } from '../integrationtest';

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
