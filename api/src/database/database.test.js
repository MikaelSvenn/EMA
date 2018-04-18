import database from './database';

describe('database', () => {
  let createClient;
  let dbClient;
  let db;

  process.env.DB_HOST = 'host';
  process.env.DB_PORT = 'port';
  process.env.DB_PASSWORD = 'word';
  process.env.DB_MAX_CONNECTION_RETRIES = 10;
  process.env.DB_RECONNECT_IN_MILLISECONDS = 100;

  beforeEach(() => {
    dbClient = {
      set: jest.fn(),
    };

    createClient = jest.fn();
    createClient.mockReturnValue(dbClient);

    db = database(createClient);
  });

  it('should create client with options', () => {
    expect(createClient).toHaveBeenCalledWith({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      maxConnectionRetries: process.env.DB_MAX_CONNECTION_RETRIES,
      reconnectAfterMilliseconds: process.env.DB_RECONNECT_IN_MILLISECONDS,
    });
  });

  describe('insert', () => {
    beforeEach(() => {
      db.insert({
        key: 'foo',
        value: 'bar',
      });
    });

    it('should set key with value', () => {
      expect(dbClient.set).toHaveBeenCalledWith('foo', 'bar', 'NX');
    });
  });
});
