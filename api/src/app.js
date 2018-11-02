import express from 'express';
import middlewareWith from './middleware';
import createRequestTrace from './requestTrace';
import createRequestFilter from './requestFilter';
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
  applicationMiddleware.useProxy();

  const crypto = createCrypto(config);
  const database = createDatabase(config, crypto.hash);

  const requestTrace = createRequestTrace(database, crypto.keyContext, crypto.hash);
  applicationMiddleware.requireUserAgent();
  applicationMiddleware.useRequestTrace(requestTrace);
  applicationMiddleware.preventBlockedClients();

  const requestFilter = createRequestFilter(database, crypto.keyContext, crypto.hash);
  applicationMiddleware.useRequestFilter(requestFilter);

  const routeHandler = routesWith(api);
  const bodyparser = createBodyparser(sanitizer);

  routeHandler.useRoutes({
    '/ping': ping,
    '/message': message(database, bodyparser, crypto.encryptInMemory),
  });

  applicationMiddleware.useExceptionHandler();

  return api;
};
