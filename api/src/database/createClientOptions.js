import createRetryStrategy from './createRetryStrategy';

export default (options, retry = createRetryStrategy) => ({
  host: options.host,
  port: options.port,
  retry_strategy: retry(options),
});
