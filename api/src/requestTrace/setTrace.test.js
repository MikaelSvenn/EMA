import setTraceFactory from './setTrace';

describe('Set request trace', () => {
  let setTrace;
  let database;
  let hash;
  let createKey;
  let createdKey;
  let createTraceFactory;
  let createTrace;
  let updateTraceFactory;
  let updateTrace;
  let verifySignatureFactory;
  let verifySignature;

  beforeEach(() => {
    database = {
      read: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
    };

    hash = jest.fn();
    hash.mockReturnValue('hashedClientId');
    createKey = jest.fn();
    createdKey = {
      toString: jest.fn().mockReturnValueOnce('sessionkey').mockReturnValueOnce('signaturekey'),
    };
    createKey.mockReturnValue(createdKey);

    createTrace = jest.fn();
    createTraceFactory = jest.fn();
    createTraceFactory.mockReturnValue(createTrace);
    updateTrace = jest.fn();
    updateTraceFactory = jest.fn();
    updateTraceFactory.mockReturnValue(updateTrace);
    verifySignature = jest.fn();
    verifySignatureFactory = jest.fn();
    verifySignatureFactory.mockReturnValue(verifySignature);

    setTrace = setTraceFactory(database, hash, createKey, createTraceFactory, updateTraceFactory, verifySignatureFactory);
  });

  it('initialization should create two keys as base64', () => {
    expect(createKey).toHaveBeenCalledTimes(2);
    expect(createdKey.toString.mock.calls[0][0]).toEqual('base64');
    expect(createdKey.toString.mock.calls[1][0]).toEqual('base64');
  });

  it('initialization should initialize createTrace with both created keys', () => {
    expect(createTraceFactory).toHaveBeenCalledWith(hash, 'sessionkey', 'signaturekey');
  });

  it('initialization should initialize updateTrace with both created keys', () => {
    expect(updateTraceFactory).toHaveBeenCalledWith(hash, 'sessionkey', 'signaturekey');
  });

  it('initialization should initialize verifySignature', () => {
    expect(verifySignatureFactory).toHaveBeenCalledWith(hash);
  });

  it('should create trace id from client ip', async () => {
    await setTrace({
      ip: 'fooip',
    });

    expect(hash).toHaveBeenCalledWith('fooip', 'sessionkey');
  });

  it('should read given trace by id', async () => {
    await setTrace({});
    expect(database.read).toHaveBeenCalledWith('trace', 'hashedClientId');
  });

  describe('when a previous trace is not found', () => {
    let client;
    let result;

    beforeEach(async () => {
      client = 'fooclient';
      database.read.mockResolvedValue(undefined);
      database.insert.mockImplementation(value => value);
      createTrace.mockReturnValue('createdtrace');
      result = await setTrace(client);
    });

    it('should create a new trace', () => {
      expect(createTrace).toHaveBeenCalledWith(client);
    });

    it('should not update trace', () => {
      expect(updateTrace).not.toHaveBeenCalled();
    });

    it('should insert the created trace to database', () => {
      expect(database.insert).toHaveBeenCalledWith('createdtrace', 600);
    });

    it('should not verify signature', () => {
      expect(verifySignature).not.toHaveBeenCalled();
    });

    it('should not update the created trace to database', () => {
      expect(database.update).not.toHaveBeenCalled();
    });

    it('should return the created trace', () => {
      expect(result).toEqual('createdtrace');
    });
  });

  describe('when a previous trace is found', () => {
    let client;
    let result;

    beforeEach(async () => {
      client = 'fooclient';
      updateTrace.mockImplementation(value => value);
      database.read.mockResolvedValue('previouslyCreatedTrace');
      database.update.mockImplementation(value => value);
      result = await setTrace(client);
    });

    it('should verify signature', () => {
      expect(verifySignature).toHaveBeenCalledWith('previouslyCreatedTrace', 'signaturekey');
    });

    it('should not create a new trace', () => {
      expect(createTrace).not.toHaveBeenCalled();
    });

    it('should update the previously created trace', () => {
      expect(updateTrace).toHaveBeenCalledWith('previouslyCreatedTrace', 'fooclient');
    });

    it('should not insert the updated trace to database', () => {
      expect(database.insert).not.toHaveBeenCalled();
    });

    it('should update the updated trace to database', () => {
      expect(database.update).toHaveBeenCalledWith('previouslyCreatedTrace', 600);
    });

    it('should return the updated trace', () => {
      expect(result).toEqual('previouslyCreatedTrace');
    });
  });
});
