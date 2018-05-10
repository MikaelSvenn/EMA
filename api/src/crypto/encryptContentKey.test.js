import encryptKeyFactory from './encryptContentKey';

describe('Encrypt content key', () => {
  let crypto;
  let encryptedKey;

  beforeEach(() => {
    crypto = {
      publicEncrypt: jest.fn(),
      constants: {
        RSA_PKCS1_OAEP_PADDING: 'oaepPadding',
      },
    };
    crypto.publicEncrypt.mockReturnValue('encrypted key');

    const publicKey = 'givenPublicKey';
    const encryptKey = encryptKeyFactory(crypto, publicKey);
    encryptedKey = encryptKey('givenKey');
  });

  it('should encrypt content key with public key', () => {
    expect(crypto.publicEncrypt).toHaveBeenCalledWith({
      key: 'givenPublicKey',
      padding: 'oaepPadding',
    }, 'givenKey');
  });

  it('should return the encrypted key', () => {
    expect(encryptedKey).toEqual('encrypted key');
  });
});
