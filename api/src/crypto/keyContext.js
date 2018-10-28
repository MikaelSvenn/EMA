export default (createKey) => {
  const sessionKey = createKey();
  const signatureKey = createKey();

  return {
    getSessionKey: () => sessionKey.toString('base64'),
    getSignatureKey: () => signatureKey.toString('base64'),
  };
};
