export default (api) => {
  api.use(async (request, response, nextCallback) => {
    if (!request.headers['user-agent']) {
      return nextCallback(new Error({
        source: 'middleware',
        cause: 'userAgentMissing',
      }));
    }

    if (request.headers['user-agent'].length > 200) {
      return nextCallback(new Error({
        source: 'middleware',
        cause: 'userAgentTooLong',
      }));
    }

    return nextCallback();
  });
};
