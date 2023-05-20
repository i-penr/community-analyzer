import express from 'express';
import { getJobs } from '../controllers/jobs';

const router = express.Router();

router.get('/fetch/:sub', getJobs);

export { router as jobRouter }