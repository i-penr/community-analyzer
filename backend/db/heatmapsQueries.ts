import { MongoError } from 'mongodb';
import conn from './db';

export async function upsertHeatmap(sub: string, data: { date: string, value: number }[]) {
    await conn.getDb().collection('heatmaps').updateOne(
        { sub: sub },
        { $set: { data } },
        { upsert: true }
    ).then(() => {
        console.log(`Heatmap data updated for subreddit ${sub}`);
    }).catch((err: MongoError) => {
        console.error(`ERROR in heatmap upsert: ${err.errmsg}`);
    });
}

export async function getHeatmapData(sub: string) {
    return await conn.getDb().collection('heatmaps').find(
        { sub: sub }
    ).collation({ locale: 'en', strength: 2 }).toArray();
}