export default crypto => (contentKey) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', contentKey, iv, {
    authTagLength: 16,
  });
  cipher.setAAD(iv);

  return {
    iv,
    cipher,
  };
};
