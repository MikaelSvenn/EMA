export default options => (requests) => {
  const lastRequest = () => requests[requests.length - 1];
  const thresholdRequest = () => requests[requests.length - options.amountOfRequests];

  if (requests.length < options.amountOfRequests) {
    return false;
  }

  if (lastRequest() - thresholdRequest() <= options.inMilliseconds) {
    return true;
  }

  return false;
};
