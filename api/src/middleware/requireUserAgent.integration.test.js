import { http } from '../integrationtest';

describe('Require user agent', () => {
  it('should return http 200 when user-agent header is present', () => http()
    .get('/ping')
    .set('user-agent', 'foo')
    .expect(200));

  it('should return http 404 when user-agent header is not present', () => http()
    .get('/ping')
    .set('user-agent', '')
    .expect(404));

  it('should be applied to all routes', () => http()
    .post('/message')
    .set('user-agent', '')
    .send({
      message: 'test',
    })
    .expect(404));
});
