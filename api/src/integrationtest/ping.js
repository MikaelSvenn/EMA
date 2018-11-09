/* eslint no-await-in-loop: 0 */
/* eslint no-param-reassign: 0 */

export default http => async (amountOfCalls, userAgent) => {
  let lastResult;
  while (amountOfCalls > 0) {
    const givenUserAgent = userAgent || amountOfCalls;
    lastResult = await http()
      .get('/ping')
      .set('user-agent', givenUserAgent);

    amountOfCalls -= 1;
  }

  return lastResult;
};
