import nodeCrypto from 'crypto';

export default (crypto = nodeCrypto) => (content) => {
  const key = crypto.randomBytes(64).toString('base64');
  const hmac = crypto.createHmac('sha256', key);

  hmac.update(content);
  return hmac.digest('hex');
};
