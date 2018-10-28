export default (filterRequest, api) => {
  api.use(async (request, response, nextCallback) => {
    try {
      await filterRequest(request.trace);
    } catch (error) {
      return nextCallback(error);
    }
    return nextCallback();
  });
};
