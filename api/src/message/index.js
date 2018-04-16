import express from 'express';
import { sendMessage } from './sendMessage';

export default (database) => {
  const router = express.Router();
  router.post('/', sendMessage(database));
  return router;
};
