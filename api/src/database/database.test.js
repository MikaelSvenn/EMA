import database from './database';

describe('database', () => {
  let createClient;
  let dbClient;
  let createContent;
  let createDbContent;
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
      setAsync: jest.fn(),
    };
    createClient = jest.fn();
    createClient.mockReturnValue(dbClient);

    createDbContent = jest.fn();
    createContent = jest.fn();
    createContent.mockReturnValue(createDbContent);
    createDbContent.mockImplementation(content => ({
      key: `${content.key} created`,
      value: `${content.value} created`,
    }));

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
    let content;
    beforeEach(() => {
      content = {
        key: 'foo',
        value: 'bar',
      };
      db.insert(content);
    });

    it('should create db content from the given content', () => {
      expect(createDbContent).toHaveBeenCalledWith(content);
    });

    it('should set key with value', () => {
      expect(dbClient.setAsync).toHaveBeenCalledWith('foo created', '"bar created"', 'NX');
    });
  });
});
