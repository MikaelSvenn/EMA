import express from 'express';
import ping from './ping';

const router = express.Router();
router.get('/', ping);

export default router;
