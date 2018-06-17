import crypto from 'crypto';
import readPublicKey from './readPublicRsaKey';

describe('Read public RSA key should', () => {
  const validRsaKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAx+PPxLIxeEdEAUg6a9pD
Ebi6d0HOnn7VRpP0NdhIiXFLD2u/fLbtHvdLZO7yjvv2qrWztBzWthM8kxEkc9E2
TZlui2FjWfC9C+xHb3upBEwI0Z8/ztzt0wnC0LBQm+m3gTUxyQwl29JEL3YBxLpJ
pV7+owYd5Ppnr5xIL/ewJ4Qqsfht8DM/yJxC3zkyjQTKzfAqW7Se+ceIzoRiNAEA
19l4doSZ2tpkMUgn0uVDYFiLURX2umaSehx9ob0cP6n0hLkylS4Tr+5ttIAo9o+Y
MUfLeKzlmxvOj+lZBC7VY1lJtJIfoXVxGFDR57WlN9qP6u+S9Pt+1HW5DGh5DGg7
JKekyIYz4RMu2Lf6MqpUhY+zodcjZw4xpDRhjvIn6D/eD0f8YvDFL7bw4LlMkwK9
fhz6q1Hck2XhEJp+gbuWPX8X80UrSMKsOa/5X+7FGnAwVXZMe/BCSDVDkAvYafsY
lwhNbLHyug0CTY+YlNU6NlWyTUFYVems7/btrRRNl5o5EGEmrLVsuEo59VU72TTC
KfsFvrc4M4PNuRULdlGQdbqyJTmgd+ELsjxGzL5IUF3NCuM9Kl/LsLXpwjUqHrKY
iu79Nqq9xnPV/ZgSGUvaDynjj0vtp7QSIJeym3VUoeob0bY+yO+o/ON566nFULX2
qn9t3nHZY0I24Jh9l/CiTysCAwEAAQ==
-----END PUBLIC KEY-----`;

  const inadequateRsaKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7LQKq5Gn22o+U6mJbVgF
id4GADUeTcNjCj3ay7wDkUuBjw3T5ZSrIs+1w3OjTSxxNp81p/guZnHgczv7MO4B
DOnkgJ6RVmdwpqGHm4XOSdojFlNdoqGz7rhcagZWxI9A5fQtcl2wNimYY95AkB6d
3xiTfMhq/1FsdrP60CWqMA5/AyJs3AZlNAvS+ImjlxJCnP8J/3gqbnmnvCemrBtG
EJ6iXxWzFpDBv5U3ZGyP2vexupk+sMrvYVPZlQhO17FTNjm5jE9fsFZIIdfnDBhW
mdt0nF8cXKv/meuUT3vcQODzbkqcz72GOOLj46Pdv8aT3q8fdbhxZuYO13GILWry
rwIDAQAB
-----END PUBLIC KEY-----`;

  let fs;
  let config;
  let result;
  let readKeyParameters;
  let encryptSpy;

  beforeEach(() => {
    fs = {
      readFileSync: (path, formatting) => {
        readKeyParameters = {
          path,
          formatting,
        };

        return validRsaKey;
      },
    };

    encryptSpy = jest.spyOn(crypto, 'publicEncrypt');

    config = {
      publicKeyPath: '/foo/bar',
    };

    result = readPublicKey(fs, crypto, config);
  });

  it('read the key from given path', () => {
    expect(readKeyParameters.path).toEqual('/foo/bar');
  });

  it('read the key as utf-8 formatted string', () => {
    expect(readKeyParameters.formatting).toEqual('utf-8');
  });

  it('encrypt a test input with the given key', () => {
    expect(encryptSpy).toHaveBeenCalledWith({
      key: validRsaKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    }, Buffer.from('test input', 'utf-8'));
  });

  describe('throw when', () => {
    it('the key cannot be read from the given path', () => {
      fs.readFileSync = () => { throw new Error('bar'); };
      expect(() => readPublicKey(fs, crypto, config)).toThrowError('Could not read key /foo/bar');
    });

    it('the given key is not valid', () => {
      const cryptoMock = {
        constants: {},
        publicEncrypt: () => { throw new Error('foo'); },
      };

      expect(() => readPublicKey(fs, cryptoMock, config)).toThrowError('The given key is not a valid PEM-formatted X.509 public RSA key.');
    });

    it('the given key does not correspond with at least 4096-bit private key', () => {
      fs.readFileSync = () => inadequateRsaKey;
      expect(() => readPublicKey(fs, crypto, config)).toThrowError('RSA key must be at least 4096-bit.');
    });
  });

  it('return the PEM-formatted key', () => {
    expect(result).toEqual(validRsaKey);
  });
});
