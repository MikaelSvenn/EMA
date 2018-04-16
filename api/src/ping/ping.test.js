import ping from './ping';

describe('ping', () => {
  let request;
  let response;

  beforeEach(() => {
    request = {
      headers: {},
    };
    response = {
      send: jest.fn(),
    };
  });

  it('should send ip from x-forwarded-for', () => {
    request.headers['x-forwarded-for'] = 'foo';

    ping(request, response);
    expect(response.send).toHaveBeenCalledWith('foo');
  });

  it('should send ip from remote address when x-forwarded-for header is not set', () => {
    request.connection = {
      remoteAddress: 'bar',
    };
    ping(request, response);
    expect(response.send).toHaveBeenCalledWith('bar');
  });
});
