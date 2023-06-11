/* eslint-disable @typescript-eslint/no-explicit-any */
import snoo from './startConn';

export async function fetchAllNewPosts(sub: string, before: string) {
    try {
        let fetched:any = (await snoo.getSubreddit(sub).getNew({ before: before, limit: Infinity }));

        if (fetched.length === 0) {
            fetched = (await snoo.getSubreddit(sub).getNew()).fetchAll({ amount: 1000 });
        }

        return fetched;

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
