import nodeCrypto from 'crypto';
import bluebird from 'bluebird';
import createSymmetricKeyFactory from './createSymmetricKey';

describe('Create symmetric key', () => {
  let crypto;
  let pbkdf2;
  let promisify;
  let kdfOptions;
  let expectedResult;
  let result;

  beforeEach(async () => {
    pbkdf2 = jest.fn();
    crypto = {
      randomBytes: jest.fn(),
      pbkdf2: 'nodepbkdf2',
    };

    crypto.randomBytes
      .mockReturnValueOnce('createdkeyprimitive')
      .mockReturnValueOnce('createdsalt');

    promisify = jest.fn();
    promisify.mockReturnValue(pbkdf2);

    expectedResult = nodeCrypto.randomBytes(32).toString('base64');
    pbkdf2.mockImplementation((key, salt, iterations, keyLength, hash) => {
      kdfOptions = {
        key,
        salt,
        iterations,
        keyLength,
        hash,
      };
      return Promise.resolve(expectedResult);
    });
    const createSymmetricKey = createSymmetricKeyFactory(crypto, promisify);
    result = await createSymmetricKey();
  });

  it('should create 32-byte key primitive', () => {
    expect(crypto.randomBytes.mock.calls[0][0]).toEqual(32);
  });

  it('should create 32-byte salt', () => {
    expect(crypto.randomBytes.mock.calls[1][0]).toEqual(32);
  });

  it('should return pbkdf2-derived key', () => {
    expect(result).toEqual(expectedResult);
  });

  describe('key derivation should be invoked with', () => {
    it('the created key primitive', () => {
      expect(kdfOptions.key).toEqual('createdkeyprimitive');
    });

    it('the created salt', () => {
      expect(kdfOptions.salt).toEqual('createdsalt');
    });

    it('200 000 iterations', () => {
      expect(kdfOptions.iterations).toEqual(200000);
    });

    it('key length of 32 bytes', () => {
      expect(kdfOptions.keyLength).toEqual(32);
    });

    it('sha-256 hash', () => {
      expect(kdfOptions.hash).toEqual('sha256');
    });
  });
});

describe('Create symmetric key (using actual node crypto)', () => {
  let createSymmetricKey;
  let key;

  beforeEach(async () => {
    createSymmetricKey = createSymmetricKeyFactory(nodeCrypto, bluebird.promisify);
    key = await createSymmetricKey();
  });

  it('should produce 32-byte key', () => {
    expect(key.length).toEqual(32);
  });

  it('should not produce the same key on subsequent calls', async () => {
    let keys = new Array(10).fill('');
    keys = await Promise.all(keys.map(() => createSymmetricKey()));
    keys.forEach((item) => {
      const keysWithoutItem = keys.filter(current => !current.equals(item));
      expect(keysWithoutItem.length).toBe(9);
    });
  });
});
