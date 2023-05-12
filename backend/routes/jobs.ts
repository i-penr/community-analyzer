import express from 'express';
import { requestJob } from '../controllers/jobs';

const router = express.Router();

router.get('/start/:sub', requestJob);

export { router as jobRouter }