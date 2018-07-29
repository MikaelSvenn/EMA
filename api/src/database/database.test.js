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
      getAsync: jest.fn(),
    };
    dbClient.getAsync.mockResolvedValue('{"content":"foobar"}');
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

    beforeEach(async () => {
      content = {
        key: 'foo',
        value: 'bar',
      };
      await db.insert(content);
    });

    it('should create db content from the given content', () => {
      expect(createDbContent).toHaveBeenCalledWith(content);
    });

    it('should set key with value', () => {
      expect(dbClient.setAsync).toHaveBeenCalledWith(['foo created', '"bar created"', 'NX']);
    });

    it('with expiration should set key with given expiration', async () => {
      await db.insert(content, 600);
      expect(dbClient.setAsync).toHaveBeenCalledWith(['foo created', '"bar created"', 'NX', 'EX', 600]);
    });
  });

  describe('update', () => {
    let content;

    beforeEach(async () => {
      content = {
        key: 'foo',
        value: 'bar',
      };
      await db.update(content);
    });

    it('should create db content from the given content', () => {
      expect(createDbContent).toHaveBeenCalledWith(content);
    });

    it('should set key with value', () => {
      expect(dbClient.setAsync).toHaveBeenCalledWith(['foo created', '"bar created"', 'XX']);
    });

    it('with expiration should set key with given expiration', async () => {
      await db.update(content, 600);
      expect(dbClient.setAsync).toHaveBeenCalledWith(['foo created', '"bar created"', 'XX', 'EX', 600]);
    });
  });

  describe('read', () => {
    let result;
    beforeEach(async () => {
      result = await db.read('foo', 'bar');
    });

    it('should get given content by given key', () => {
      expect(dbClient.getAsync).toHaveBeenCalledWith('foo|bar');
    });

    it('should return content as json object', () => {
      expect(result).toEqual({
        content: 'foobar',
        key: 'bar',
      });
    });

    it('should return false when no content is returned', async () => {
      dbClient.getAsync.mockResolvedValue(undefined);
      result = await db.read('foo', 'bar');
      expect(result).toEqual(false);
    });
  });
});
