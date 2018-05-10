import createCipherFactory from './createCipher';

describe('Create cipher', () => {
  let crypto;
  let createCipher;
  let createdCipher;
  let result;

  beforeEach(() => {
    createdCipher = {
      setAAD: jest.fn(),
    };

    crypto = {
      randomBytes: jest.fn(),
      createCipheriv: jest.fn(),
    };
    crypto.randomBytes.mockReturnValue('iv');
    crypto.createCipheriv.mockReturnValue(createdCipher);

    createCipher = createCipherFactory(crypto);
    result = createCipher('foobar');
  });

  it('should create iv', () => {
    expect(crypto.randomBytes).toHaveBeenCalledWith(12);
  });

  it('should create aes256-gcm cipher with key, iv and tag length', () => {
    expect(crypto.createCipheriv).toHaveBeenCalledWith('aes-256-gcm', 'foobar', 'iv', { authTagLength: 16 });
  });

  it('should set iv as cipher aad', () => {
    expect(createdCipher.setAAD).toHaveBeenCalledWith('iv');
  });

  it('should return the initialized cipher with the created iv', () => {
    expect(result).toEqual({
      iv: 'iv',
      cipher: createdCipher,
    });
  });
});
