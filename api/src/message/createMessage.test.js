import createMessage from './createMessage';

describe('Create message', () => {
  let result;
  let validateMessage;

  beforeEach(() => {
    const request = {
      ip: 'request ip',
      body: {
        message: 'given message',
      },
      headers: {},
    };
    request.headers['user-agent'] = 'client user agent';
    validateMessage = jest.fn();
    result = createMessage(request, validateMessage);
  });

  it('should set type as "message"', () => {
    expect(result.type).toEqual('message');
  });

  it('should map request ip to source', () => {
    expect(result.value.source).toEqual('request ip');
  });

  it('should set userAgent by request header', () => {
    expect(result.value.userAgent).toEqual('client user agent');
  });

  it('should set message from request body', () => {
    expect(result.value.message).toEqual('given message');
  });

  it('should validate the created message', () => {
    expect(validateMessage).toHaveBeenCalledWith(result);
  });
});
