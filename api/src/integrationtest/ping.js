/* eslint no-await-in-loop: 0 */

export default http => async (amountOfCalls, options = {}) => {
  let lastResult;
  let requestCount = 1;
  while (requestCount <= amountOfCalls) {
    const givenUserAgent = options.userAgent || requestCount;
    lastResult = await http(options.http)
      .get('/ping')
      .set('user-agent', givenUserAgent);

    requestCount += 1;
  }

  return lastResult;
};
