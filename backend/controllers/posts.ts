/* eslint-disable @typescript-eslint/no-explicit-any */
import conn from '../db/db';
import { Db, ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { fetchSubmission } from '../snoowrap/getData';
import { getIndividualSub } from '../db/subQueries';
import { startTask } from './mainTask';
import { getLatestPost, getPostsFromDb, insertOnePost } from '../db/postQueries';
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
    if (post.created > (await getLatestPost(post.subreddit))?.created) {
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

    return post;
}