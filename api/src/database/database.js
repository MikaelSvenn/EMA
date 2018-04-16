import createClient from './createClient';

export default (options, createDbClient = createClient) => {
  const dbClient = createDbClient(options);

  return {
    put: (content) => {
      throw new Error('not implemented');
    },
  };
};
