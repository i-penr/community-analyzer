import { getPostsFromDb } from "../db/postQueries";

export async function generateSubscriberGrowthData (sub: string) {
    const unsortedData = await getPostsFromDb(sub);
    const data = unsortedData.sort((a, b) =>  a.created - b.created);
    const subscriberData: { date: string, subscribers: number }[] = [];

    for (const entry of data) {
        const subscribers = entry.subreddit_subscribers;
        const postDate = new Date(entry.created * 1000).toLocaleDateString();
        

        const existingEntry = subscriberData.find((item) => item.date === postDate);

        if (!existingEntry)
            subscriberData.push({ date: postDate, subscribers: subscribers });
        else if (existingEntry?.subscribers < subscribers) {
            existingEntry?.subscribers === subscribers;
        }
    }

    return subscriberData;
}