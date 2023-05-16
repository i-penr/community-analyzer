import conn from './db';
import { MongoError } from 'mongodb';
import { isDeleted } from '../snoowrap/isDeleted';

export async function insertPosts(data: Document[]) {
    await conn.getDb().collection('posts').insertMany(data, { ordered: false })
        .then((result) => {
            console.log(`${result.insertedCount} items inserted.`);
        }).catch((err: MongoError) => {
            console.error(`ERROR in post insert: ${err.errmsg}`);
    });
}

export async function getLatestPostName(sub: string) {
    const latestPosts = await conn.getDb().collection('posts').find(
        { subreddit: sub },
        { collation: { locale: 'en', strength: 2 }, sort: { created: -1 } }
    ).toArray();
    let i = 0;

    if (latestPosts.length !== 0) {
        while (i <= 5 && await isDeleted(latestPosts[i].id)) i++;
        return latestPosts[i].name;
    } else return '';
}

export async function getPosts(sub: string) {
    return await conn.getDb().collection('posts').find(
        { subreddit: sub },
        { sort: { created: -1 }}
    ).collation({ locale: 'en', strength: 2 }).toArray();
}

