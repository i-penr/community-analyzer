/* eslint-disable @typescript-eslint/no-explicit-any */
import conn from '../db/db';
import { Db, ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { fetchSubmission } from '../snoowrap/getData';
import { getIndividualSub } from '../db/subQueries';
import { startTask } from './mainTask';
import { countPosts, getLatestPost, getPostsFromDb, insertOnePost, searchPosts } from '../db/postQueries';
import { upsertJob } from '../db/jobQueries';
import { upsertHeatmap } from '../db/heatmapsQueries';
import { upsertKeywords } from '../db/keywordsQueries';
import { generateHeatmapData } from '../services/heatmapDataGenerator';
import { generateKeywords } from '../services/keywordGenerator';

let db: Db;


// GET
export async function getPosts(req: Request, res: Response) {
    conn.getDb().collection('posts').find({}).toArray().then((posts) => {
        res.status(200).send(posts);
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ err: 'Unable to find documents' });
    });
}

export async function getPostsFromSub(req: Request, res: Response) {
    const posts = await getPostsFromDb(req.params.sub);

    if (posts.length === 0) {
        res.status(404).send({ msg: 'Sub not in db' });
    } else {
        return res.status(200).send(posts);
    }
}

export async function getFirstPost(req: Request, res: Response) {
    const sub = req.params.sub;
    const sort = Number(req.params.sort);

    if (sort * sort !== 1)
        return res.status(400).send({ msg: 'Bad request' });

    const post = await getLatestPost(sub, sort as 1 | -1);

    if (!post) {
        return res.status(404).send({ msg: 'Post not found' });
    }

    return res.status(200).send(post);
}

// POST
export async function postPostByUrl(req: Request, res: Response) {
    const url: string = req.params[0];

    if (!url.startsWith('https://www.reddit.com/r/'))
        return res.status(400).send({ msg: 'URL not valid' });

    await handlePostResult(url.split("/")[6], res);
}

export async function postPostById(req: Request, res: Response) {
    await handlePostResult(req.params.id, res);
}

async function postIndividualPost(id: string) {
    try {
        let post: any = await getPostById(id);
        post = await removeUselessData(post.toJSON());
        const subreddit = post.subreddit;

        const checkSubResult = await checkIfSubIsInDb(subreddit);

        const checkPostNewerThanDbResult = await checkPostIsNewerThanDb(post);

        const insertResult = await insertOnePost(JSON.parse(JSON.stringify(post)));

        if (!checkSubResult && checkPostNewerThanDbResult !== 200 && insertResult === 409)
            throw new Error("409");

        await updateTables(post.subreddit);

        return 200;

    } catch (err: any) {
        if (err.message === "409" || err.message === "404")
            return Number(err.message);

        return 500;
    }

}

async function updateTables(sub: string) {
    const calendarData = await generateHeatmapData(sub);
    const keywordData = await generateKeywords(sub);

    await upsertJob(sub);
    await upsertHeatmap(sub, calendarData);
    await upsertKeywords(sub, keywordData);
}

async function checkPostIsNewerThanDb(post: any) {
    if (post.created > (await getLatestPost(post.subreddit, -1))?.created) {
        await startTask(post.subreddit);
        await insertOnePost(JSON.parse(JSON.stringify(post)));
        return 200;
    }
}

async function getPostById(id: string) {
    return await fetchSubmission(id);
}

async function checkIfSubIsInDb(sub: string) {
    const subDb = await getIndividualSub(sub);

    if (!subDb) {
        await startTask(sub);
        return 200;
    }
}

export async function searchPostsWithFilters(req: Request, res: Response) {
    const { post, sub, date, user, orderBy }: any = req.query;
    const { page, limit }: any = req.query;
    let posts = [];
    const orderByObj = getOrderByOjb(orderBy);

    try {
        const skip: number = (Number(page) - 1) * Number(limit);

        const filter: any = {};

        if (post) {
            filter.$or =  [
                { title: { $regex: new RegExp(decodeURIComponent(post), "i") } },
                { selftext: { $regex: new RegExp(decodeURIComponent(post), "i") } }
            ];
        }

        if (user) {
            filter.author = { $regex: new RegExp(`^${user}$`, 'i') };
        }

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(startDate.getTime() + 86400*1000);

            filter.created = {
                $gte: Number(Math.floor(startDate.getTime() / 1000)),
                $lt: Number(Math.floor(endDate.getTime() / 1000))
            };
        }

        if (sub !== 'Any') {
            filter.subreddit = { $regex: new RegExp(`^${sub}$`, 'i') };
        }

        posts = await searchPosts(filter, orderByObj, skip, Number(limit));
        const totalPosts = await countPosts(filter);
        const totalPages = Math.ceil(totalPosts / Number(limit));

        return res.status(200).send({ posts: posts, totalPosts: totalPosts, currentPage: page, totalPages: totalPages });

    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: 'Internal Server Error' });
    }
}

function getOrderByOjb(orderBy: string) {
    switch (orderBy) {
        case 'Latest':
            return { created: -1 }
        case 'Oldest':
            return { created: 1 }
        case 'Title A-Z':
            return { title: 1 }
        case 'Title Z-A':
            return { title: -1 }
        case 'Description A-Z':
            return { selftext: 1 }
        case 'Description Z-A':
            return { selftext: -1 }
        case 'User A-Z':
            return { author: 1 }
        case 'User Z-A':
            return { author: 1 }
        default:
            return { created: -1 }
    }
}

async function handlePostResult(id: string, res: Response<any, Record<string, any>>) {
    const result = await postIndividualPost(id);

    if (result === 200) {
        res.status(200).send({ msg: 'Post inserted successfully' });
    } else {
        res.status(result).send({ msg: 'There was an error saving the submission.' });
    }
}

// DELETE
export async function deleteAllPosts(req: Request, res: Response) {
    db = conn.getDb();

    db.collection('posts').deleteMany({}).then((result) => {
        res.status(200).send({ msg: `Deleted ${result.deletedCount} items` });
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ err: err });
    });
}

export async function deletePostById(req: Request, res: Response) {
    const id = req.params.id;

    if (ObjectId.isValid(id)) {
        db.collection('posts').deleteOne({ _id: new ObjectId(id) }).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).send({ err: 'Cannnot delete' });
        });
    }
}

async function removeUselessData(doc: Document) {
    const post: any = doc;

    delete post.all_awardings;
    delete post.awarders;
    delete post.comments;
    delete post.subscribers; // We remove this because this counts present subscribers, not the post's date

    return post;
}