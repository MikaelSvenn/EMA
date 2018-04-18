import redis from 'redis';
import createClientOptions from './createClientOptions';

export default (options, redisInstance = redis, createOptions = createClientOptions) => {
  const clientOptions = createOptions(options);
  const redisClient = redisInstance.createClient(clientOptions);
  redisClient.auth(options.password);

  return redisClient;
};
