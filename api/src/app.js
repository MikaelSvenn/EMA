import express from 'express';
import middlewareWith from './middleware';

const api = express();

const applicationMiddleware = middlewareWith(api);
applicationMiddleware.useHelmet();

api.get('/', (request, result) => result.send('Ok.'));

export default api;
