import createClient from './createClient';

export default (createDbClient = createClient) => {
  const dbClient = createDbClient({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    maxConnectionRetries: process.env.DB_MAX_CONNECTION_RETRIES,
    reconnectAfterMilliseconds: process.env.DB_RECONNECT_IN_MILLISECONDS,
  });

  return {
    insert: (content) => {
      dbClient.set(content.key, content.value, 'NX');
    },
  };
};
