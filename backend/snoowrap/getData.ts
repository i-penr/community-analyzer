/* eslint-disable @typescript-eslint/no-explicit-any */
import snoo from './startConn';

export async function fetchAllNewPosts(sub: string, before: string) {
    try {
        let posts = (await snoo.getSubreddit(sub).getNew({ before: before })).fetchAll({ amount: 1000 });

        if (JSON.parse(JSON.stringify(posts)).length === 0) {
            console.log("hoo")
            posts = (await snoo.getSubreddit(sub).getNew()).fetchAll({ amount: 1000 });
        }

        return posts;

    } catch (err: any) {
        if (err.statusCode == 404) {
            return [];
        } else if (err.statusCode === 403) {
            throw new Error('403');
        }
    }
}

export async function fetchSubMetadata(sub: string) {
    return new Promise((resolve) => {
        snoo.getSubreddit(sub).fetch().then(resolve);  
    });
}

export async function fetchSubmission(id: string) {
    return new Promise((resolve, reject) => {
        snoo.getSubmission(id).fetch().then(resolve).catch((err) => {
            if (err.statusCode === 404)
                reject(new Error('404'))

            reject(new Error('500'));
        });
    });
}
