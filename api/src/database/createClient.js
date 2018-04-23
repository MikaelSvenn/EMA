import redis from 'redis';
import createClientOptions from './createClientOptions';

export default (dbConfig, redisInstance = redis, createOptions = createClientOptions) => {
  const clientOptions = createOptions(dbConfig);
  const redisClient = redisInstance.createClient(clientOptions);
  redisClient.auth(dbConfig.password);

  return redisClient;
};
