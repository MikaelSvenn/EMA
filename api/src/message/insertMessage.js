export default (database, createMessage) => (request, response) => {
  const message = createMessage(request.body);
  database.insert(message);
  response.sendStatus(200);
};
