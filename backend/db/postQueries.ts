/* eslint-disable @typescript-eslint/no-explicit-any */
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

export async function insertOnePost(data: Document) {
    return await conn.getDb().collection('posts').insertOne(data)
        .then(() => {
            console.log('Post inserted.');
        }).catch((err: MongoError) => {
            console.error(`ERROR in post insert: ${err.errmsg}`);
            if (err.errmsg.includes('duplicate key error'))
                return 409;
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

export async function getLatestPost(sub: string, sort: -1 | 1) {
    const latestPost = await conn.getDb().collection('posts').findOne(
        { subreddit: sub },
        { collation: { locale: 'en', strength: 2 }, sort: { created: sort } }
    );

    return latestPost;
}

export async function getPostsFromDb(sub: string) {
    return await conn.getDb().collection('posts').find(
        { subreddit: sub },
        { collation: { locale: 'en', strength: 2 }, sort: { created: -1 }}
    ).toArray();
}

export async function searchPosts(filter: { date?: string, post?: string, user?: string, subreddit?: string }, orderByObj: any, skip: number, limit: number) {
    return await conn.getDb().collection('posts').find(filter,
        { collation: { locale: 'en', strength: 2 }} 
     ).sort(orderByObj).skip(skip).limit(limit).toArray();
}

export async function countPosts(filter?: { date: string, post: string, user: string, subreddit?: string }) {
    return conn.getDb().collection('posts').countDocuments(filter);
}

export async function countAllPosts() {
    return conn.getDb().collection('posts').countDocuments();
}