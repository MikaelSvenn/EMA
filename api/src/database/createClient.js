import redis from 'redis';
import createClientOptions from './createClientOptions';

export default (redisInstance = redis, createOptions = createClientOptions, options) => {
  const clientOptions = createOptions(options);
  const redisClient = redisInstance.createClient(clientOptions);
  redisClient.auth(options.password);

  return redisClient;
};
