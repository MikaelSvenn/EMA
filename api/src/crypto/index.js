import crypto from 'crypto';
import fs from 'fs';
import bluebird from 'bluebird';
import createHash from './hash';
import readPublicKey from './readPublicRsaKey';
import createKey from './createSymmetricKey';
import createCipher from './createCipher';
import encryptContentKey from './encryptContentKey';
import createEncrypt from './encrypt';
import createEncryptInMemory from './encryptInMemory';
import createReadStream from './createReadStream';
import createWriteStream from './createWriteStream';

export default (config) => {
  const publicKey = readPublicKey(fs, crypto, config);
  const encrypt = createEncrypt(createKey(crypto, bluebird.promisify), encryptContentKey(crypto, publicKey), createCipher(crypto));

  return {
    hash: createHash(),
    encrypt,
    encryptInMemory: createEncryptInMemory(encrypt, createReadStream, createWriteStream),
  };
};
