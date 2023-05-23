import express from 'express';
import { getPosts, deleteAllPosts, deletePostById, getPostsFromSub } from '../controllers/posts';

const router = express.Router();

router.get('/all', getPosts);
router.get('/:sub', getPostsFromSub);

router.delete('/delete/all', deleteAllPosts);
router.delete('/delete/:id', deletePostById);


export { router as postRouter }