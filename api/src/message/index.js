import express from 'express';
import sendMessage from './sendMessage';

export default (database, bodyparser) => {
  const router = express.Router();
  router.post('/', bodyparser.json(), sendMessage(database));
  return router;
};
