import express from 'express';
import { deleteAllJobs, deleteAllPosts, deleteJobBySub, deletePostById, deletePostsFromSub, deleteSubById, deleteSubByName, getAllJobs, getAllPosts, getAllSubs, getJobBySub, getPostsBySub, getSubByName } from '../controllers/debug';

const router = express.Router();

router.get('/jobs/get/:sub', getJobBySub);
router.get('/jobs/get', getAllJobs);
router.get('/posts/get/:sub', getPostsBySub);
router.get('/posts/get', getAllPosts);
router.get('/subs/get/:sub', getSubByName);
router.get('/subs/get', getAllSubs);

router.delete('/jobs/delete/sub/:sub', deleteJobBySub);
router.delete('/jobs/delete', deleteAllJobs);
router.delete('/posts/delete/sub:sub', deletePostsFromSub);
router.delete('/posts/delete/id/:id', deletePostById);
router.delete('/posts/delete', deleteAllPosts);
router.delete('/subs/delete/sub/:sub', deleteSubByName);
router.delete('/subs/delete/sub/:id', deleteSubById);

export { router as debugRouter }