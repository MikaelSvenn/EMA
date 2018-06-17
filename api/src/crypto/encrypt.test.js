/* eslint no-underscore-dangle: 0 */

import crypto from 'crypto';
import stream from 'stream';
import bluebird from 'bluebird';
import createEncryptFactory from './encrypt';
import createContentKeyFactory from './createSymmetricKey';
import createCipherFactory from './createCipher';
import encryptContentKeyFactory from './encryptContentKey';

describe('Encrypt', () => {
  const privateRsaKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDstAqrkafbaj5T
qYltWAWJ3gYANR5Nw2MKPdrLvAORS4GPDdPllKsiz7XDc6NNLHE2nzWn+C5mceBz
O/sw7gEM6eSAnpFWZ3CmoYebhc5J2iMWU12iobPuuFxqBlbEj0Dl9C1yXbA2KZhj
3kCQHp3fGJN8yGr/UWx2s/rQJaowDn8DImzcBmU0C9L4iaOXEkKc/wn/eCpueae8
J6asG0YQnqJfFbMWkMG/lTdkbI/a97G6mT6wyu9hU9mVCE7XsVM2ObmMT1+wVkgh
1+cMGFaZ23ScXxxcq/+Z65RPe9xA4PNuSpzPvYY44uPjo92/xpPerx91uHFm5g7X
cYgtavKvAgMBAAECggEBAOXMMOO6B9VbguDkIfhW0SG0u+ytpRrnypohzO2oPWps
fH5udT5YpACq2JLFDFAbClp2HLhSmHF6suYM4GPzXG+2DtHTn9PbnqEXBrk1IT3P
merNyoTeKfpjX8zLFKfFT8Mv2INEc5NRtJGYLuP75Va23FDznfT7jqp7Ns+nEV+O
hRqfWo8fiTuliezH5EJtJeO4cAg3fiU3VxQmjt0U0c/LvQvxlBpsik7ui+z3eyh2
U5ZTWD2PkOSehWWVCoJHWJYhtVcr9AUCCT0mZOznVvKEWaF1c7jyT0NQYxB/C/9D
ZHfmEuKdGAmsjxL4V/r/Wvm8Qsk8cvwWALejXfemh4ECgYEA/NUTniv48XjmCZsH
lG5EX0+5tKKoNxzpkVAp/m/EX5J+wYLOl+jpTGnn388lrv98YdNSTJEsQhRiH/eE
QiHo4qkwzzVv+G+GOIGVlk7wRj0MBEyQMi+3c7gUnmPtBcS1By+8YdVbzO1V5l5S
3WlhQaT5e3JGcfr1xEGA1e83aEECgYEA76s7xB2ojCMnZ+F7aHgr8hz3bAM8wzjR
5mgSxuBuIP88Hc+Us1yt2U56wiAVpj8D0+wgNWPZL5t6jwqa8owp5zyGolaDbXpR
ROW8UF0ObSF0DPdm5HwTIPcY/4AxQnHC0e/ia6kaAD5nQAxoAiFwrgsF5Zd60Qgc
GMiIRiQ5Hu8CgYA5c4Gds4hB9qLvE9dJFzVaIxejwEJRI7S/XGPueR86SGOdPUgM
pNQ+lOInrT524X82C3rsAyD3cwJJGUlobaQpvSBmNVJYNZ9eP7PqD83xZ/XPFEa/
4K/jD7U/uJ0nbmdkVqiL4puVmWinjE9wGH4NGJvIPVNcmxY1nlzUQCNrAQKBgQCK
7BKEpzxfnrDkwgqqj53JhYjVjzrVXkYs6/6WUNkFP201SnHDVeFfqOH3TGnAJ56s
ZJ521B28Pr9X0qnmFeDkLG1OBB/CgbhB23jAjHAkSdPfADkgD9t2rERNNZ1YCmEH
F6mDBk4P/hwTQB25vnB2MeWFI70JFU5T/0kefzis+QKBgCeTveqDf/YEZAHq4LuN
YT6chchkgyS7VeFjxCLrtltMHmyujWqVyM2kj+8qSgFRIVNNb0jB9re7iWFw7yhT
WcAzp0MFYqRRBYAjX+QJxMN8cI9+dcXzkRqL6tXv1vPgLfOEOtQMT64PVU1USUud
culQ9szvSjE4IO8cDsKJr8yQ
-----END PRIVATE KEY-----`;

  const publicRsaKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7LQKq5Gn22o+U6mJbVgF
id4GADUeTcNjCj3ay7wDkUuBjw3T5ZSrIs+1w3OjTSxxNp81p/guZnHgczv7MO4B
DOnkgJ6RVmdwpqGHm4XOSdojFlNdoqGz7rhcagZWxI9A5fQtcl2wNimYY95AkB6d
3xiTfMhq/1FsdrP60CWqMA5/AyJs3AZlNAvS+ImjlxJCnP8J/3gqbnmnvCemrBtG
EJ6iXxWzFpDBv5U3ZGyP2vexupk+sMrvYVPZlQhO17FTNjm5jE9fsFZIIdfnDBhW
mdt0nF8cXKv/meuUT3vcQODzbkqcz72GOOLj46Pdv8aT3q8fdbhxZuYO13GILWry
rwIDAQAB
-----END PUBLIC KEY-----
`;

  const contentToEncrypt = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

  let encryptionContext;
  let encryptedOutput;
  let encryptionResult;

  let encrypt;

  const createEncryptionContext = () => {
    const inputStream = new stream.Readable();
    inputStream._read = () => {};
    inputStream.push(contentToEncrypt);
    inputStream.push(null);

    const outputStream = new stream.Writable();
    outputStream._write = (chunk, encoding, callback) => {
      encryptedOutput = chunk;
      callback();
    };

    return {
      inputStream,
      outputStream,
    };
  };

  beforeEach(async () => {
    const createContentKey = createContentKeyFactory(crypto, bluebird.promisify);
    const createCipher = createCipherFactory(crypto);
    const encryptContentKey = encryptContentKeyFactory(crypto, publicRsaKey);

    encrypt = createEncryptFactory(createContentKey, encryptContentKey, createCipher);
    encryptionContext = createEncryptionContext();

    encryptionResult = await encrypt(encryptionContext);
  });

  it('should return encryption key', () => {
    expect(encryptionResult.key.length).not.toBe(0);
  });

  it('should return initialization vector', () => {
    expect(encryptionResult.iv.length).not.toBe(0);
  });

  it('should return authentication tag', () => {
    expect(encryptionResult.tag.length).not.toBe(0);
  });

  it('should produce ciphertext', () => {
    expect(encryptedOutput.length).not.toBe(0);
    expect(encryptedOutput.toString('utf8')).not.toEqual(contentToEncrypt);
  });

  const decrypt = () => {
    const decryptionKey = crypto.privateDecrypt(privateRsaKey, Buffer.from(encryptionResult.key, 'base64'));
    const decipher = crypto.createDecipheriv('aes-256-gcm', decryptionKey, Buffer.from(encryptionResult.iv, 'base64'));

    decipher.setAuthTag(Buffer.from(encryptionResult.tag, 'base64'));
    decipher.setAAD(Buffer.from(encryptionResult.iv, 'base64'));

    let decryptedContent = decipher.update(encryptedOutput, 'binary', 'utf8');
    decryptedContent += decipher.final('utf8');
    return decryptedContent;
  };

  it('ciphertext should decrypt to given input', () => {
    const decryptedContent = decrypt();
    expect(decryptedContent).toEqual(contentToEncrypt);
  });

  it('should obfuscate the original plaintext content key after encryption', async () => {
    const createContentKey = createContentKeyFactory(crypto, bluebird.promisify);
    const contentKey = await createContentKey();

    const createKeyMock = () => contentKey;

    const encryptContentKey = encryptContentKeyFactory(crypto, publicRsaKey);
    const createCipher = createCipherFactory(crypto);
    encrypt = createEncryptFactory(createKeyMock, encryptContentKey, createCipher);

    encryptionContext = createEncryptionContext();

    await encrypt(encryptionContext);

    const expectedBuffer = Buffer.alloc(contentKey.length).fill('.');
    expect(contentKey).toEqual(expectedBuffer);
  });

  it('should fail decryption on tampered IV', () => {
    const ivBuffer = Buffer.from(encryptionResult.iv, 'base64');
    ivBuffer[0] += 1;
    encryptionResult.iv = ivBuffer.toString('base64');
    expect(() => decrypt()).toThrow();
  });

  it('should fail decryption on tampered signature', () => {
    const tagBuffer = Buffer.from(encryptionResult.tag, 'base64');
    tagBuffer[0] += 1;
    encryptionResult.tag = tagBuffer.toString('base64');
    expect(() => decrypt()).toThrow();
  });

  it('should fail decryption on tampered content', () => {
    encryptedOutput[0] += 1;
    expect(() => decrypt()).toThrow();
  });
});
