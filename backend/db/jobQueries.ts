import conn from './db';
import { MongoError } from 'mongodb';

export async function upsertJob(sub: string) {
    await conn.getDb().collection('jobs').updateOne(
        { sub: sub },
        { $set: { status: 'available', sub: sub }, $currentDate: { lastUpdated: true } },
        { upsert: true }
    ).then(() => {
        console.log(`Job updated for subreddit ${sub}`);
    }).catch((err: MongoError) => {
        console.error(`ERROR in job upsert: ${err.errmsg}`);
    });
}

export async function getJob(sub: string) {
    return await conn.getDb().collection('jobs').findOne({ sub: sub });
}

export async function updateJobStatus(status: string, sub: string) {
    await conn.getDb().collection('jobs').updateOne(
        { sub: sub },
        { $set: { status: '' }}
    )
}

export async function getAllJobs(sub: string) {
    return await conn.getDb().collection('jobs').find({ sub: sub }).toArray();
}