export default hash => (trace, key) => {
  const content = Object.assign({}, trace.value);
  const expectedSignature = content.signature;
  delete content.signature;

  const signature = hash(JSON.stringify(content), key);
  if (expectedSignature !== signature) {
    throw new Error({
      source: 'trace',
      cause: 'signature',
    });
  }
};
