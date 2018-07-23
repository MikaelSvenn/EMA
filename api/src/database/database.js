import createClient from './createClient';
import mapDbContent from './createDbContent';

export default (config, hash, createDbClient = createClient, createContent = mapDbContent) => {
  const dbClient = createDbClient(config.database);
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
        return JSON.parse(result);
      }
      return false;
    },
    update: async (content, expiration) => {
      await writeToDatabase(content, 'XX', expiration);
    },
  };
};
