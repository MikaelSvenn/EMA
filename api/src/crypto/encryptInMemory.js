

export default (encrypt, createReadStream, createWriteStream) => async (content) => {
  const writeStream = createWriteStream();
  const context = {
    inputStream: createReadStream(JSON.stringify(content)),
    outputStream: writeStream.stream,
  };
  const encryptionContext = await encrypt(context);

  encryptionContext.data = writeStream.content().toString('base64');
  return encryptionContext;
};
