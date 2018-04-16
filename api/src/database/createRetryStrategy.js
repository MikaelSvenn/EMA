export default options => (retry) => {
  if (retry.error && retry.error.code === 'ECONNREFUSED') {
    return new Error('The database connection was refused.');
  }

  if (retry.attempt > options.maxConnectionRetries) {
    return new Error(`Could not connect to the database after ${options.maxConnectionRetries} retries`);
  }

  return options.reconnectAfterMilliseconds;
};
