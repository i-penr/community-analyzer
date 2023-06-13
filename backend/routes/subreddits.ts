import express from 'express';
import { getSubByName } from '../controllers/subreddits';

const router = express.Router();

router.get('/all');
router.get('/get/:sub', getSubByName);

export { router as subredditRouter }