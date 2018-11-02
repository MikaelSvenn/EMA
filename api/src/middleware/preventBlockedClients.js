export default (api) => {
  api.use(async (request, response, nextCallback) => {
    if (request.trace.isBlocked) {
      return nextCallback(new Error('Received request from blocked client'));
    }

    return nextCallback();
  });
};
