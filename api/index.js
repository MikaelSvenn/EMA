import express from 'express';

const api = express();
api.get('/', (request, result) => result.send('Ok.'));

api.listen(27910);
