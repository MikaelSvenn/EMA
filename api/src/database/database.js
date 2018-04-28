import createClient from './createClient';
import mapDbContent from './createDbContent';

export default (config, hash, createDbClient = createClient, createContent = mapDbContent) => {
  const dbClient = createDbClient(config.database);
  const createDbContent = createContent(hash);

  return {
    insert: async (content) => {
      const dbContent = createDbContent(content);
      await dbClient.setAsync(dbContent.key, JSON.stringify(dbContent.value), 'NX');
    },
  };
};
