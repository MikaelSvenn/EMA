import createRetryStrategy from './createRetryStrategy';

describe('retry strategy', () => {
  let options;
  let strategy;
  beforeEach(() => {
    options = {
      connectionRetries: 10,
      reconnectInMilliseconds: 500,
    };
    strategy = createRetryStrategy(options);
  });

  it('should return error when error code is "ECONNREFUSED"', () => {
    const actual = strategy({
      error: {
        code: 'ECONNREFUSED',
      },
    });
    expect(actual).toEqual(new Error({
      source: 'database',
      cause: 'connectionRefused',
    }));
  });

  it('should return error when retry attempt exceeds maximum retries', () => {
    const actual = strategy({
      attempt: 11,
    });
    expect(actual).toEqual(new Error({
      source: 'database',
      cause: 'offline',
    }));
  });

  it('should return the given reconnect value', () => {
    const actual = strategy({});
    expect(actual).toEqual(500);
  });
});
