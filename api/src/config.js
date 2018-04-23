export default {
  server: {
    listenOn: process.env.LISTEN_ON,
  },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    connectionRetries: process.env.DB_MAX_CONNECTION_RETRIES,
    reconnectInMilliseconds: process.env.DB_RECONNECT_IN_MILLISECONDS,
  },
};
