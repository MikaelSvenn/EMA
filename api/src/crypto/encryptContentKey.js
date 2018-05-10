export default (crypto, publicKey) => (contentKey) => {
  const encryptKeyOptions = {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  };

  return crypto.publicEncrypt(encryptKeyOptions, contentKey);
};
