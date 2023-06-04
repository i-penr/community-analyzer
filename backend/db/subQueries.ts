import { MongoError } from 'mongodb';
import conn from './db';

export async function upsertSub(sub: string, data: Document[]) {
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

export async function getIndividualSub(sub: string) {
    return await conn.getDb().collection('subs').findOne(
        { subreddit: sub.toLowerCase() }
    );
}

export async function getSubLang(sub: string) {
    const subreddit = await conn.getDb().collection('subs').findOne(
                                { subreddit: sub },
                                { projection: { _id: 0, lang: 1 }, collation: { locale: 'en', strength: 2 } }
    );

    return subreddit?.lang;
}