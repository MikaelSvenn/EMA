import createClient from './createClient';

export default (config, createDbClient = createClient) => {
  const dbClient = createDbClient(config.database);
  return {
    insert: (content) => {
      dbClient.set(content.key, content.value, 'NX');
    },
  };
};
