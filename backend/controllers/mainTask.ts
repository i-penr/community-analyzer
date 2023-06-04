/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { addJobToQueue } from '../bullmq/queue';
import { QueueEvents } from 'bullmq';
import { fetchAllNewPosts, fetchSubMetadata } from '../snoowrap/getData';
import { upsertJob, getJobFromDb } from '../db/jobQueries';
import { insertPosts, getLatestPostName } from '../db/postQueries';
import * as dotenv from 'dotenv';
import { upsertSub } from '../db/subQueries';
import { removeUserRelatedData } from './subreddits';
import { generateKeywords } from '../services/keywordGenerator';
import { upsertKeywords } from '../db/keywordsQueries';
import { generateHeatmapData } from '../services/heatmapDataGenerator';
import { upsertHeatmap } from '../db/heatmapsQueries';
dotenv.config();


export async function requestTask(req: Request, res: Response) {
    if (req.params.sub.length > 22 || req.params.sub.length === 0) 
        return res.status(400).send({ msg: 'ERROR: Bad request (400)' });

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

export async function startTask(sub: string) {
    sub = sub.toLowerCase();
    const job = await getJobFromDb(sub);

    if (!job || new Date().getTime() - job.lastUpdated.getTime() >= 10) { // 10800000 = 3h
        const latestPostName = await getLatestPostName(sub);
        const postData = await fetchAllNewPosts(sub, latestPostName);

        if (postData && postData.length > 0) {
            await insertPosts(JSON.parse(JSON.stringify(postData)));
        } else if (!latestPostName) {
            return 404;
        }

        await fetchAndInsertSub(sub);
        await generateAndInsertKeywords(sub);
        await generateAndInsertHeatmapData(sub);
        await upsertJob(sub);
    }

    return { msg: 'Job completed successfully (200)', statusCode: 200, subreddit: sub };
}

async function generateAndInsertHeatmapData(sub: string) {
    const heatmapData: { date: string; value: number; }[] = await generateHeatmapData(sub);
    await upsertHeatmap(sub, heatmapData);
}

async function generateAndInsertKeywords(sub: string) {
    const keywords: { term: string; score: number; numDocuments: number; }[] = await generateKeywords(sub);
    await upsertKeywords(sub, keywords);
}

async function fetchAndInsertSub(sub: string) {
    let subData: any = await fetchSubMetadata(sub);
    subData = removeUserRelatedData(subData.toJSON());

    await upsertSub(sub, subData);
}

