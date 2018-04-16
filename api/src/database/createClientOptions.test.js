import createClientOptions from './createClientOptions';

describe('create client options', () => {
  let options;
  let clientOptions;
  let createRetryStrategy;

  beforeEach(() => {
    createRetryStrategy = jest.fn();
    createRetryStrategy.mockReturnValue('foobar');
    options = {
      host: 'foo',
      port: 'bar',
    };
    clientOptions = createClientOptions(options, createRetryStrategy);
  });

  it('should set host', () => {
    expect(clientOptions.host).toBe('foo');
  });

  it('should set port', () => {
    expect(clientOptions.port).toBe('bar');
  });

  it('should create retry strategy', () => {
    expect(createRetryStrategy).toHaveBeenCalledWith(options);
  });

  it('should set retry strategy', () => {
    expect(clientOptions.retry_strategy).toEqual(createRetryStrategy(options));
  });
});
