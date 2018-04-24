export default (database, createDbContent, createMessage) => (request, response) => {
  const message = createMessage(request);
  const content = createDbContent('message', message);
  database.insert(content);
  response.sendStatus(200);
};
