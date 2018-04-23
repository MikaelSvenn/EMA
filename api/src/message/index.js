import express from 'express';
import createMessage from './createMessage';
import insertMessage from './insertMessage';

export default (database, bodyparser) => {
  const router = express.Router();
  router.post('/', bodyparser.json(), insertMessage(database, createMessage));
  return router;
};
