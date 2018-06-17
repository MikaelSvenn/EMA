export default (createContentKey, encryptContentKey, createCipher) => async (context) => {
  const contentKey = await createContentKey();
  const cipherContext = createCipher(contentKey);
  const encryptedKey = await encryptContentKey(contentKey);

  return new Promise((resolve, reject) => {
    context.outputStream.on('finish', () => {
      contentKey.fill('.');
      resolve({
        key: encryptedKey.toString('base64'),
        iv: cipherContext.iv.toString('base64'),
        tag: cipherContext.cipher.getAuthTag().toString('base64'),
      });
    });

    context.inputStream.on('error', reject);
    context.outputStream.on('error', reject);

    context.inputStream.pipe(cipherContext.cipher).pipe(context.outputStream);
  });
};
