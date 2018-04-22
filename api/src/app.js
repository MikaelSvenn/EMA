import express from 'express';
import middlewareWith from './middleware';
import createBodyparser from './bodyparser';
import sanitizer from './sanitizer';
import routesWith from './route';
import createDatabase from './database';
import ping from './ping';
import message from './message';

export default () => {
  const api = express();

  const applicationMiddleware = middlewareWith(api);
  applicationMiddleware.useHelmet();

  const database = createDatabase();

  const routeHandler = routesWith(api);
  const bodyparser = createBodyparser(sanitizer);

  routeHandler.useRoutes({
    '/ping': ping,
    '/message': message(database, bodyparser),
  });

  applicationMiddleware.useExceptionHandler();

  return api;
};
