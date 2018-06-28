import crypto from 'crypto';

export default (privateRsaKey, encryptionContext, encryptedContent) => {
  const decryptionKey = crypto.privateDecrypt(privateRsaKey, Buffer.from(encryptionContext.key, 'base64'));
  const decipher = crypto.createDecipheriv('aes-256-gcm', decryptionKey, Buffer.from(encryptionContext.iv, 'base64'));

  decipher.setAuthTag(Buffer.from(encryptionContext.tag, 'base64'));
  decipher.setAAD(Buffer.from(encryptionContext.iv, 'base64'));

  let decryptedContent = decipher.update(encryptedContent, 'binary', 'utf8');
  decryptedContent += decipher.final('utf8');
  return decryptedContent;
};
