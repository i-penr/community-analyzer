import express from 'express';
import { insertSub, getSubs, deleteAllSubs, deleteSubById, deleteSubByName } from '../controllers/subreddits';

const router = express.Router();

router.get('/all', getSubs);

router.post('/insert/:sub', insertSub);

router.delete('/delete/all', deleteAllSubs);
router.delete('/delete/:id', deleteSubById);
router.delete('/delete/name/:name', deleteSubByName);

export { router as subredditRouter }