import { getPostsFromDb } from "../db/postQueries";


export async function generateHeatmapData(sub: string) {
    const data = await getPostsFromDb(sub);
    const calendarData: { date: string, value: number }[] = [];


    for (const entry of data) {
        const date = new Date(entry.created*1000);
        const dateString = `${date.getUTCFullYear()}-${addZeroIfOneDigit(date.getUTCMonth() + 1)}-${addZeroIfOneDigit(date.getUTCDate())}`;

        const existingEntry = calendarData.find((item) => item.date === dateString);

        if (existingEntry) {
            existingEntry.value++;
        } else {
            calendarData.push({ date: dateString, value: 1 });
        }
    }


    return calendarData;
}

function addZeroIfOneDigit(num: number) {
    return ('0' + num).slice(-2);
}