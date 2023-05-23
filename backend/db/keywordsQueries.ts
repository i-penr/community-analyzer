import { MongoError } from 'mongodb';
import conn from './db';

export async function upsertKeywords(sub: string, data: { term: string, score: number, numDocuments: number }[]) {
    await conn.getDb().collection('keywords').updateOne(
        { sub: sub },
        { $set: { data } },
        { upsert: true }
    ).then(() => {
        console.log(`Keywords updated for subreddit ${sub}`);
    }).catch((err: MongoError) => {
        console.error(`ERROR in keyword upsert: ${err.errmsg}`);
    });
}