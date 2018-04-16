export default (request, response) => {
  const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
  response.send(ip);
};
