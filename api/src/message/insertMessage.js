export default (database, createMessage, encrypt) => async (request, response) => {
  const message = createMessage(request);
  const encryptedMessage = await encrypt(message.value);
  const content = {
    type: message.type,
    value: encryptedMessage,
  };

  await database.insert(content);
  response.sendStatus(200);
};
