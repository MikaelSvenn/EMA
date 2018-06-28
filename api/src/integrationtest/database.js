import Redis from 'redis';
import bluebird from 'bluebird';

export default () => {
  const redisClient = Redis.createClient(process.env.DB_PORT, process.env.DB_HOST);
  bluebird.promisifyAll(redisClient);
  redisClient.auth(process.env.DB_PASSWORD);

  return redisClient;
};
