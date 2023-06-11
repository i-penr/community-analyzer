import express from 'express';
import { getJobs } from '../controllers/jobs';

const router = express.Router();

router.get('/getAll', getJobs);

export { router as jobRouter }