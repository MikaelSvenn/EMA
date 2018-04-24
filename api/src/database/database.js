import createClient from './createClient';
import mapDbContent from './createDbContent';

export default (config, hash, createDbClient = createClient, createContent = mapDbContent) => {
  const dbClient = createDbClient(config.database);
  const createDbContent = createContent(hash);

  return {
    insert: (content) => {
      const dbContent = createDbContent(content);
      dbClient.set(dbContent.key, dbContent.value, 'NX');
    },
  };
};
