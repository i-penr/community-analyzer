import { MongoError } from 'mongodb';
import conn from './db';

export async function upsertSubscriberData(sub: string, data: { date: string, subscribers: number }[]) {
    await conn.getDb().collection('subscribers').updateOne(
        { sub: sub.toLowerCase() },
        { $set: { data } },
        { upsert: true }
    ).then(() => {
        console.log(`Suscribers data updated for subreddit ${sub}`);
    }).catch((err: MongoError) => {
        console.error(`ERROR in subscriber upsert: ${err.errmsg}`);
    });
}

export async function getSubscriberDataFromDb(sub: string) {
    return await conn.getDb().collection('subscribers').findOne(
        { sub: sub.toLowerCase() }
    );
}