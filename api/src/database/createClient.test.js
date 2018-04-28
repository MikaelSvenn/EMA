import connectToDatabase from './createClient';

describe('create client', () => {
  let createClientOptions;
  let clientOptions;
  let redis;
  let promisify;
  let createdClient;
  let options;
  let actual;

  beforeEach(() => {
    clientOptions = {
      foo: 'bar',
    };

    createClientOptions = jest.fn();
    createClientOptions.mockReturnValue(clientOptions);

    redis = {
      createClient: jest.fn(),
    };
    createdClient = {
      auth: jest.fn(),
    };

    redis.createClient.mockReturnValue(createdClient);
    promisify = {
      promisifyAll: jest.fn(),
    };

    options = {
      host: 'foo',
      port: 'bar',
      password: 'foobar',
    };

    actual = connectToDatabase(options, redis, createClientOptions, promisify);
  });

  it('should create client options', () => {
    expect(createClientOptions).toHaveBeenCalledWith(options);
  });

  it('should create client with client options', () => {
    expect(redis.createClient).toHaveBeenCalledWith(clientOptions);
  });

  it('should promisify the created client', () => {
    expect(promisify.promisifyAll).toHaveBeenCalledWith(createdClient);
  });

  it('should authenticate with password', () => {
    expect(createdClient.auth).toHaveBeenCalledWith('foobar');
  });

  it('should return redis client', () => {
    expect(actual).toEqual(createdClient);
  });
});
