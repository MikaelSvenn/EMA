export default (crypto, promisify) => async () => {
  const kdf = promisify(crypto.pbkdf2);
  const keyPrimitive = crypto.randomBytes(32);
  const salt = crypto.randomBytes(32);
  return kdf(keyPrimitive, salt, 200000, 32, 'sha256');
};

const createSync = crypto => () => {
  const keyPrimitive = crypto.randomBytes(32);
  const salt = crypto.randomBytes(32);
  return crypto.pbkdf2Sync(keyPrimitive, salt, 200000, 32, 'sha256');
};

export { createSync };
