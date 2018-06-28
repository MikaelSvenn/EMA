import { http } from '../integrationtest';

describe('GET /ping', () => {
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
});
