import createClient from './createClient';
import mapDbContent from './createDbContent';
import createDbMutex from './createMutex';

export default (config, hash, createDbClient = createClient, createContent = mapDbContent, createMutex = createDbMutex) => {
  const dbClient = createDbClient(config.database);
  const mutex = createMutex(dbClient, {
    retryCount: 20,
    retryDelay: 30,
    retryJitter: 10,
  });

  const createDbContent = createContent(hash);

  const writeToDatabase = async (content, mode, expiration) => {
    const dbContent = createDbContent(content);
    const setParameters = [dbContent.key, JSON.stringify(dbContent.value), mode];
    if (expiration) {
      setParameters.push('EX');
      setParameters.push(expiration);
    }

    await dbClient.setAsync(setParameters);
  };

  return {
    insert: async (content, expiration) => {
      await writeToDatabase(content, 'NX', expiration);
    },
    read: async (type, key) => {
      const result = await dbClient.getAsync(`${type}|${key}`);
      if (result) {
        const entity = JSON.parse(result);
        entity.key = key;
        return entity;
      }
      return false;
    },
    update: async (content, expiration) => {
      await writeToDatabase(content, 'XX', expiration);
    },
    lock: async resource => mutex.lock(`mutex|${resource}`, 1000),
  };
};
