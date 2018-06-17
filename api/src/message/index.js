import promiseRouter from 'express-promise-router';
import createMessage from './createMessage';
import insertMessage from './insertMessage';

export default (database, bodyparser, encrypt) => {
  const router = promiseRouter();
  router.post('/', bodyparser.json(), insertMessage(database, createMessage, encrypt));
  return router;
};
