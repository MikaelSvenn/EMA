export default (setTrace, api) => {
  api.use(async (request, response, nextCallback) => {
    try {
      request.trace = await setTrace({
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      });
    } catch (error) {
      return nextCallback(error);
    }
    return nextCallback();
  });
};
