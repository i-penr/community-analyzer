/* eslint-disable @typescript-eslint/no-explicit-any */
import snoo from "./startConn";

export async function isDeleted(id: string) {
    const post: any = await getPostMetadata(id)
    return post.removed_by_category !== null;
}

async function getPostMetadata(id: string) {
    return new Promise((resolve) => {
        snoo.getSubmission(id).fetch().then(resolve);
    });
}