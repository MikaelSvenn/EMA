export default options => (retry) => {
  if (retry.error && retry.error.code === 'ECONNREFUSED') {
    return new Error({
      source: 'database',
      cause: 'connectionRefused',
    });
  }

  if (retry.attempt > options.connectionRetries) {
    return new Error({
      source: 'database',
      cause: 'offline',
    });
  }

  return options.reconnectInMilliseconds;
};
