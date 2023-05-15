import { MongoError } from 'mongodb';
import conn from './db';

export async function upsertSub(sub: string, data: any) {
    await conn.getDb().collection('subs').updateOne(
        { subreddit: sub }, 
        { $set: data },
        { collation: { locale: 'en', strength: 2 }, upsert: true }
    ).then(() => {
        console.log(`Subreddit ${sub} upserted successfully`)
    }).catch((err: MongoError) => {
        console.error(`ERROR in sub upsert: ${err.errmsg}`);
    });
}
