export default options => (retry) => {
  if (retry.error && retry.error.code === 'ECONNREFUSED') {
    return new Error('The database connection was refused.');
  }

  if (retry.attempt > options.connectionRetries) {
    return new Error(`Could not connect to the database after ${options.connectionRetries} retries`);
  }

  return options.reconnectInMilliseconds;
};
