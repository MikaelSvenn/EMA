import express from 'express';
import middlewareWith from './middleware';
import bodyparser from './bodyparser';
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
  routeHandler.useRoutes({
    '/ping': ping,
    '/message': message(database, bodyparser),
  });

  applicationMiddleware.useExceptionHandler();

  return api;
};
