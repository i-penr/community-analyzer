import express from 'express';
import { getPosts, deleteAllPosts, deletePostById, getPostsFromSub, postPostById, postPostByUrl } from '../controllers/posts';

const router = express.Router();

router.get('/all', getPosts);
router.get('/:sub', getPostsFromSub);

router.post('/id/:id', postPostById);
router.post('/url/*', postPostByUrl);
router.delete('/delete/all', deleteAllPosts);
router.delete('/delete/:id', deletePostById);



export { router as postRouter }