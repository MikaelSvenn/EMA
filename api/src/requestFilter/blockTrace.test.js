import createBlockTrace from './blockTrace';

describe('Block trace', () => {
  let database;
  let mutex;
  let keyContext;
  let hash;
  let blockTrace;
  let trace;
  let result;

  beforeEach(async () => {
    mutex = {
      unlock: jest.fn(),
    };
    mutex.unlock.mockResolvedValue();
    database = {
      lock: jest.fn(),
      update: jest.fn(),
    };
    database.lock.mockResolvedValue(mutex);
    database.update.mockResolvedValue();
    keyContext = {
      getSignatureKey: () => 'signaturekey',
    };
    hash = jest.fn();
    hash.mockReturnValue('hashresult');

    blockTrace = createBlockTrace(database, keyContext, hash);

    trace = {
      key: 'tracekey',
      value: {
        isBlocked: false,
        signature: 'previousSignature',
        clients: {
          foobarid: {
            isBlocked: false,
          },
        },
      },
    };
  });

  function shouldLockAndUnlockMutex() {
    it('lock the mutex', () => {
      expect(database.lock).toHaveBeenCalledWith('tracekey');
    });

    it('unlock the mutex', () => {
      expect(mutex.unlock).toHaveBeenCalled();
    });
  }

  function shouldSignTheTrace() {
    it('create signature for the given content with the given key', () => {
      const contentWithoutSignature = Object.assign({}, result.value);
      delete contentWithoutSignature.signature;
      const expectedContent = JSON.stringify(contentWithoutSignature);
      expect(hash).toHaveBeenCalledWith(expectedContent, 'signaturekey');
    });

    it('sign the blocked trace', () => {
      expect(result.value.signature).toEqual('hashresult');
    });
  }

  describe('when no client id is specified should', () => {
    beforeEach(async () => {
      result = await blockTrace(trace);
    });

    shouldLockAndUnlockMutex();
    shouldSignTheTrace();

    it('update the blocked trace to database with 5 days expiration', () => {
      expect(database.update).toHaveBeenCalledWith(result, 432000);
    });

    it('set the whole trace as blocked', () => {
      expect(result.value.isBlocked).toEqual(true);
    });
  });

  describe('when clientId is specified should', () => {
    beforeEach(async () => {
      result = await blockTrace(trace, 'foobarid');
    });

    shouldLockAndUnlockMutex();
    shouldSignTheTrace();

    it('update the blocked trace to database with 5 days expiration', () => {
      expect(database.update).toHaveBeenCalledWith(result, 432000);
    });

    it('should not block the whole trace', () => {
      expect(result.value.isBlocked).toEqual(false);
    });

    it('should set the given client as blocked', () => {
      expect(result.value.clients.foobarid.isBlocked).toEqual(true);
    });
  });
});
