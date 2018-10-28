import requestTraceFactory from './requestTrace';

describe('Request trace', () => {
  let requestTrace;
  let database;
  let hash;
  let keyContext;
  let createTrace;
  let updateTrace;
  let verifyTrace;
  let mutex;

  beforeEach(() => {
    database = {
      read: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      lock: jest.fn(),
    };

    mutex = {
      unlock: jest.fn(),
    };
    database.lock.mockResolvedValue(mutex);

    hash = jest.fn();
    hash.mockReturnValue('hashedClientId');
    keyContext = {
      getSignatureKey: () => 'signature key',
      getSessionKey: () => 'session key',
    };

    createTrace = jest.fn();
    updateTrace = jest.fn();
    verifyTrace = jest.fn();

    requestTrace = requestTraceFactory(database, keyContext, hash, createTrace, updateTrace, verifyTrace);
  });

  it('should create trace id from client ip', async () => {
    await requestTrace({
      ip: 'fooip',
    });

    expect(hash).toHaveBeenCalledWith('fooip', 'session key');
  });

  it('should acquire mutex with traceId', async () => {
    await requestTrace({});
    expect(database.lock).toHaveBeenCalledWith('hashedClientId');
  });

  it('should read given trace by id', async () => {
    await requestTrace({});
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
      result = await requestTrace(client);
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
      expect(verifyTrace).not.toHaveBeenCalled();
    });

    it('should not update the created trace to database', () => {
      expect(database.update).not.toHaveBeenCalled();
    });

    it('should return the created trace', () => {
      expect(result).toEqual('createdtrace');
    });

    it('should release mutex', () => {
      expect(mutex.unlock).toHaveBeenCalled();
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
      result = await requestTrace(client);
    });

    it('should verify signature', () => {
      expect(verifyTrace).toHaveBeenCalledWith('previouslyCreatedTrace', 'signature key');
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

    it('should release mutex', () => {
      expect(mutex.unlock).toHaveBeenCalled();
    });
  });
});
