import database from './database';

describe('database', () => {
  let createClient;
  let dbClient;
  let createContent;
  let db;
  let config;
  let hash;

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

    const createDbContent = jest.fn();
    createContent = jest.fn();
    createContent.mockReturnValue(createDbContent);
    createDbContent.mockImplementation(content => content);

    hash = { foo: 'bar' };
    db = database(config, hash, createClient, createContent);
  });

  it('should create client with options', () => {
    expect(createClient).toHaveBeenCalledWith(config.database);
  });

  it('should create content creator with hash', () => {
    expect(createContent).toHaveBeenCalledWith(hash);
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
