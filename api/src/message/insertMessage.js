export default (database, createMessage) => async (request, response) => {
  const message = createMessage(request);
  await database.insert(message);
  response.sendStatus(200);
};
