import crypto from 'crypto';
import fs from 'fs';
import bluebird from 'bluebird';
import createHash from './hash';
import readPublicKey from './readPublicRsaKey';
import createSymmetricKey, { createSync } from './createSymmetricKey';
import createKeyContext from './keyContext';
import createCipher from './createCipher';
import encryptContentKey from './encryptContentKey';
import createEncrypt from './encrypt';
import createEncryptInMemory from './encryptInMemory';
import createReadStream from './createReadStream';
import createWriteStream from './createWriteStream';

export default (config) => {
  const publicKey = readPublicKey(fs, crypto, config);
  const createKey = createSymmetricKey(crypto, bluebird.promisify);
  const createKeySync = createSync(crypto);
  const keyContext = createKeyContext(createKeySync);
  const encrypt = createEncrypt(createKey, encryptContentKey(crypto, publicKey), createCipher(crypto));

  return {
    hash: createHash(),
    createKey,
    keyContext,
    encrypt,
    encryptInMemory: createEncryptInMemory(encrypt, createReadStream, createWriteStream),
  };
};
