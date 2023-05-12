import snoo from './startConn';

export async function fetchAllHotPosts(sub: string, before: string) {
    try {
        return (await snoo.getSubreddit(sub).getNew({ before: before })).fetchAll({ amount: 0, append: true });
    } catch (err: any) {
        if (err.statusCode == 404) {
            return [];
        } else if (err.statusCode === 403) {
            throw new Error('403');
        }
    }
}
