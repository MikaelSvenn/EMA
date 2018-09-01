export default (api) => {
  api.use(async (request, response, nextCallback) => {
    if (!request.headers['user-agent']) {
      return nextCallback(new Error('missingUserAgent'));
    }
    return nextCallback();
  });
};
