import express from 'express';
import middlewareWith from './middleware';
import routesWith from './route';
import createDatabase from './database/database';
import ping from './ping';
import message from './message';

const api = express();

const applicationMiddleware = middlewareWith(api);
applicationMiddleware.useHelmet();

const database = createDatabase({
  host: 'localhost',
  port: 27920,
  password: 'assword',
  maxConnectionRetries: 20,
  reconnectAfterMilliseconds: 5000,
});

const routeHandler = routesWith(api);
routeHandler.useRoutes({
  '/ping': ping,
  '/message': message(database),
});

applicationMiddleware.useExceptionHandler();
export default api;
