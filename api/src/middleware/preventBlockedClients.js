export default (api) => {
  api.use(async (request, response, nextCallback) => {
    if (request.trace.isBlocked) {
      return nextCallback(new Error({
        source: 'middleware',
        cause: 'requestFromBlockedTrace',
      }));
    }

    return nextCallback();
  });
};
