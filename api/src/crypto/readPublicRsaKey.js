export default (fs, crypto, config) => {
  let publicKey;
  try {
    publicKey = fs.readFileSync(config.publicKeyPath, 'utf-8');
  } catch (error) {
    throw new Error(`Could not read key ${config.publicKeyPath}`);
  }

  const encryptKeyOptions = {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  };

  try {
    crypto.publicEncrypt(encryptKeyOptions, Buffer.from('test input', 'utf-8'));
  } catch (error) {
    throw new Error('The given key is not a valid PEM-formatted X.509 public RSA key.');
  }

  const publicKeyLines = publicKey.split(/\r?\n/);
  if (publicKeyLines.length < 14) {
    throw new Error('RSA key must be at least 4096-bit.');
  }

  return publicKey;
};
