import express from 'express';
import middlewareWith from './middleware';
import createBodyparser from './bodyparser';
import sanitizer from './sanitizer';
import routesWith from './route';
import createDatabase from './database';
import createCrypto from './crypto';
import ping from './ping';
import message from './message';

export default (config) => {
  const api = express();

  const applicationMiddleware = middlewareWith(api);
  applicationMiddleware.useHelmet();

  const crypto = createCrypto(config);
  const database = createDatabase(config, crypto.hash);

  const routeHandler = routesWith(api);
  const bodyparser = createBodyparser(sanitizer);

  routeHandler.useRoutes({
    '/ping': ping,
    '/message': message(database, bodyparser, crypto.encryptInMemory),
  });

  applicationMiddleware.useExceptionHandler();

  return api;
};
