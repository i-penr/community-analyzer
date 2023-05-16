import conn from './db';
import { MongoError } from 'mongodb';

export async function insertPosts(data: Document[]) {
    await conn.getDb().collection('posts').insertMany(data, { ordered: false })
        .then((result) => {
            console.log(`${result.insertedCount} items inserted.`);
        }).catch((err: MongoError) => {
            console.error(`ERROR in post insert: ${err.errmsg}`);
    });
}

export async function getLatestPostName(sub: string) {
    const latestPost = await conn.getDb().collection('posts').findOne(
        { subreddit: sub },
        { collation: { locale: 'en', strength: 2 }, sort: { created: -1 } }
    );

    return latestPost ? latestPost.name : '';
}

export async function getPosts(sub: string) {
    return await conn.getDb().collection('posts').find({ subreddit: sub }).collation({ locale: 'en', strength: 2 }).toArray();
}

