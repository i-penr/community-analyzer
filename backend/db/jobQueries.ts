import conn from './db';
import { MongoError } from 'mongodb';

export async function upsertJob(sub: string, status: string) {
    await conn.getDb().collection('jobs').updateOne(
        { sub: sub.toLowerCase() },
        { $set: { status: status, sub: sub }, $currentDate: { lastUpdated: true } },
        { upsert: true }
    ).then(() => {
        console.log(`Job updated for subreddit ${sub}`);
    }).catch((err: MongoError) => {
        console.error(`ERROR in job upsert: ${err.errmsg}`);
    });
}

export async function getJobFromDb(sub: string) {
    return await conn.getDb().collection('jobs').findOne({ sub: sub.toLowerCase() });
}

export async function updateJobStatus(sub: string, status: string) {
    await conn.getDb().collection('jobs').updateOne(
        { sub: sub },
        { $set: { status: status }}
    )
}

export async function getAllJobs() {
    return await conn.getDb().collection('jobs').find({}, { sort: { sub: 1 }}).toArray();
}