import conn from '../db';
import { Request, Response } from 'express';
import { addJobToQueue } from '../bullmq/queue';
import { QueueEvents } from 'bullmq';
import { MongoError } from 'mongodb';
import { fetchAllHotPosts } from '../snoowrap/getData';
import * as dotenv from 'dotenv';
dotenv.config();


export async function requestJob(req: Request, res: Response) {
    const job = await addJobToQueue({ type: 'StartJob', sub: String(req.params.sub) });

    const queueEvents = new QueueEvents('mainQueue', {
        connection: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT)
        }
    })

    job.waitUntilFinished(queueEvents).then((result) => {
        if (isNaN(result))
            return res.status(200).send(result);
        else {
            if (result === 404)
                return res.status(result).send({ msg: `ERROR: Subreddit r/${req.params.sub} does not exist (${result})`, statusCode: result });
            else if (result === 403)
                return res.status(result).send({ msg: `ERROR: r/${req.params.sub} is a private community. (${result}).`, statusCode: result });
            else
                return res.status(500).send({ msg: 'There was an error in your request (500)', statusCode: 500 });
        }
    }); 
    
}

export async function startJob(sub: string) {
    const job = await findJob(sub);

    if (!job || new Date().getTime() - job.lastUpdated.getTime() >= 10) { // 10800000 = 3h
        const latestPostName = await getLatestPostName(sub);
        let data = await fetchAllHotPosts(sub, latestPostName);

        if (data && data.length > 0) {
            data = JSON.parse(JSON.stringify(data));
            await insertPosts(data);
        } else if (!latestPostName) {
            return 404;
        }

        await upsertJob(sub);
    }

    return getDataFromDb(sub);
}

async function getLatestPostName(sub: string) {
    const latestPost = await conn.getDb().collection('posts').findOne(
        { subreddit: sub },
        { collation: { locale: 'en', strength: 2 }, sort: { created: -1 }}
    );

    return latestPost ? latestPost.name : '';
}

async function insertPosts(data: any) {
    await conn.getDb().collection('posts').insertMany(data, { ordered: false })
        .then((result) => {
            console.log(`${result.insertedCount} items inserted.`);
        }).catch((err: MongoError) => { 
            console.error(`ERROR in post insert: ${err.errmsg}`); 
        });
}

async function upsertJob(sub: string) {
    await conn.getDb().collection('jobs').updateOne(
        { sub: sub },
        { $set: { status: 'available', sub: sub }, $currentDate: { lastUpdated: true } },
        { upsert: true })
        .then(() => {
            console.log(`Job updated for subreddit ${sub}`);
        }).catch((err: MongoError) => { 
            console.error(`ERROR in job upsert: ${err.errmsg}`); 
        });
}

async function getDataFromDb(sub: string) {
    return await conn.getDb().collection('posts').find({ subreddit: sub }).collation({ locale: 'en', strength: 2 }).toArray();
}

async function findJob(sub: string) {
    return await conn.getDb().collection('jobs').findOne({ sub: sub });
}

