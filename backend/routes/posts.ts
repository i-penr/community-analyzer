import express from 'express';
import { searchPostsWithFilters, postPostById, postPostByUrl, getFirstPost, countPostsInSub, getPostUpvoteRatio } from '../controllers/posts';

const router = express.Router();

router.get('/all');
router.get('/latest/:sub&:sort', getFirstPost);
router.get('/search', searchPostsWithFilters);
router.get('/count/:sub', countPostsInSub);
router.get('/upvotes/:sub', getPostUpvoteRatio);

router.post('/id/:id', postPostById);
router.post('/url/*', postPostByUrl);


export { router as postRouter }