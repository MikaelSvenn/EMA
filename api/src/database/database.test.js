import database from './database';

describe('database', () => {
  let createClient;
  let dbClient;
  let db;
  let config;

  beforeEach(() => {
    config = {
      database: {
        host: 'host',
        port: 'port',
        password: 'word',
        connectionRetries: 10,
        reconnectInMilliseconds: 100,
      },
    };
    dbClient = {
      set: jest.fn(),
    };

    createClient = jest.fn();
    createClient.mockReturnValue(dbClient);

    db = database(config, createClient);
  });

  it('should create client with options', () => {
    expect(createClient).toHaveBeenCalledWith(config.database);
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
