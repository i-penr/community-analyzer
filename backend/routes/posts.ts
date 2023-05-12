import express from 'express';
import { getPosts, insertPosts, deleteAllPosts, deletePostById, insertAllPosts } from '../controllers/posts';

const router = express.Router();

router.get('/all', getPosts);

router.post('/insert/:sub&:limit', insertPosts);
router.post('/insert/:sub', insertAllPosts);

router.delete('/delete/all', deleteAllPosts);
router.delete('/delete/:id', deletePostById);


export { router as postRouter }