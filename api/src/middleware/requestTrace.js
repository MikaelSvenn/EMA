export default (traceRequest, api) => {
  api.use(async (request, response, nextCallback) => {
    try {
      request.trace = await traceRequest({
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      });
    } catch (error) {
      return nextCallback(error);
    }
    return nextCallback();
  });
};
