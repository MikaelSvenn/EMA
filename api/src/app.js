import express from 'express';
import middlewareWith from './middleware';

const api = express();

const applicationMiddleware = middlewareWith(api);
applicationMiddleware.useHelmet();

api.get('/', (request, response) => response.send('Ok!'));

applicationMiddleware.useExceptionHandler();
export default api;
