import Redis from 'redis';
import bluebird from 'bluebird';
import CreateOptions from './createClientOptions';

export default (dbConfig, redis = Redis, createOptions = CreateOptions, promisify = bluebird) => {
  const clientOptions = createOptions(dbConfig);
  const redisClient = redis.createClient(clientOptions);
  promisify.promisifyAll(redisClient);
  redisClient.auth(dbConfig.password);

  return redisClient;
};
