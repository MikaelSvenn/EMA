import nodeCrypto from 'crypto';

export default (crypto = nodeCrypto) => (content, key) => {
  let hashKey;

  if (!key) {
    hashKey = crypto.randomBytes(64).toString('base64');
  } else {
    hashKey = key;
  }

  const hmac = crypto.createHmac('sha256', hashKey);

  hmac.update(content);
  return hmac.digest('hex');
};
