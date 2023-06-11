import express from 'express';
import { searchPostsWithFilters, getPosts, deleteAllPosts, deletePostById, getPostsFromSub, postPostById, postPostByUrl, getFirstPost } from '../controllers/posts';

const router = express.Router();

router.get('/all', getPosts);
router.get('/latest/:sub&:sort', getFirstPost);
router.get('/search', searchPostsWithFilters);
router.get('/get/:sub', getPostsFromSub);

router.post('/id/:id', postPostById);
router.post('/url/*', postPostByUrl);
router.delete('/delete/all', deleteAllPosts);
router.delete('/delete/:id', deletePostById);



export { router as postRouter }