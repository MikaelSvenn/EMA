import createHash from './hash';

describe('Hash', () => {
  let crypto;
  let result;
  let hash;
  let randomBytes;
  let hmac;

  beforeEach(() => {
    crypto = {
      randomBytes: jest.fn(),
      createHmac: jest.fn(),
    };

    randomBytes = {
      toString: jest.fn(),
    };
    randomBytes.toString.mockReturnValue('key');
    crypto.randomBytes.mockReturnValue(randomBytes);

    hmac = {
      update: jest.fn(),
      digest: jest.fn(),
    };

    hmac.digest.mockReturnValue('hash');
    crypto.createHmac.mockReturnValue(hmac);

    hash = createHash(crypto);
  });

  function testHash() {
    it('should update the given content to digest', () => {
      expect(hmac.update).toHaveBeenCalledWith('foobar');
    });

    it('should produce the digest as hex', () => {
      expect(hmac.digest).toHaveBeenCalledWith('hex');
    });

    it('should return the digest result', () => {
      expect(result).toEqual('hash');
    });

    it('should result in 64-character digest', () => {
      const actualHash = createHash();
      const actualResult = actualHash('foo');
      expect(actualResult.length).toBe(64);
    });
  }

  describe('when key is not given', () => {
    beforeEach(() => {
      result = hash('foobar');
    });

    it('should create key of 64 random bytes', () => {
      expect(crypto.randomBytes).toHaveBeenCalledWith(64);
    });

    it('should get key as base64', () => {
      expect(randomBytes.toString).toHaveBeenCalledWith('base64');
    });

    it('should create hmac-sha256 with the created key', () => {
      expect(crypto.createHmac).toHaveBeenCalledWith('sha256', 'key');
    });

    it('should not produce same result for same hashed content', () => {
      const actualHash = createHash();
      const results = Array(100).fill().map(() => actualHash('foo'));

      const uniqueDigests = [...new Set(results)];
      expect(uniqueDigests.length).toEqual(100);
    });

    testHash();
  });

  describe('when key is given', () => {
    beforeEach(() => {
      result = hash('foobar', 'foobarkey');
    });

    it('should not create key', () => {
      expect(crypto.randomBytes).not.toHaveBeenCalled();
    });

    it('should create hmac-sha256 with the given key', () => {
      expect(crypto.createHmac).toHaveBeenCalledWith('sha256', 'foobarkey');
    });

    it('should produce the same result for the same hashed content', () => {
      const actualHash = createHash();
      const results = [actualHash('foo', 'bar'), actualHash('foo', 'bar'), actualHash('foo', 'bar')];
      expect(results.every(value => value === results[0])).toEqual(true);
    });

    testHash();
  });
});
