export default database => async (request, response) => {
  await database.put(request.message);
  response.sendStatus(200);
};
