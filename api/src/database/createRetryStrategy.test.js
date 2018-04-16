import createRetryStrategy from './createRetryStrategy';

describe('retry strategy', () => {
  let options;
  let strategy;
  beforeEach(() => {
    options = {
      maxConnectionRetries: 10,
      reconnectAfterMilliseconds: 500,
    };
    strategy = createRetryStrategy(options);
  });

  it('should return error when error code is "ECONNREFUSED"', () => {
    const actual = strategy({
      error: {
        code: 'ECONNREFUSED',
      },
    });
    expect(actual).toEqual(new Error('The database connection was refused.'));
  });

  it('should return error when retry attempt exceeds maximum retries', () => {
    const actual = strategy({
      attempt: 11,
    });
    expect(actual).toEqual(new Error('Could not connect to the database after 10 retries'));
  });

  it('should return the given reconnect value', () => {
    const actual = strategy({});
    expect(actual).toEqual(500);
  });
});
