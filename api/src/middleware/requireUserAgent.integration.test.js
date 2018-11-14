import { http, redis } from '../integrationtest';

describe('Require user agent', () => {
  afterAll(() => {
    redis.flushall();
  });

  it('should return http 200 when user-agent header is present', () => http()
    .get('/ping')
    .set('user-agent', 'foo')
    .expect(200));

  it('should return http 404 when user-agent header is not present', () => http()
    .get('/ping')
    .set('user-agent', '')
    .expect(404));

  it('should return http 404 when user-agent header is over 200 characters', () => http()
    .get('/ping')
    .set('user-agent', 'a'.repeat(201))
    .expect(404));

  it('should be applied to all routes', () => http()
    .post('/message')
    .set('user-agent', '')
    .send({
      message: 'test',
    })
    .expect(404));
});
