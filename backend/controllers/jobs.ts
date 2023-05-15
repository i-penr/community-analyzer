import { Request, Response } from 'express';
import { addJobToQueue } from '../bullmq/queue';
import { QueueEvents } from 'bullmq';
import { fetchAllHotPosts, fetchSubMetadata } from '../snoowrap/getData';
import { upsertJob, getJob } from '../db/jobQueries';
import { insertPosts, getLatestPostName, getPosts } from '../db/postQueries';
import * as dotenv from 'dotenv';
import { upsertSub } from '../db/subQueries';
import Snoowrap from 'snoowrap';
dotenv.config();


export async function requestJob(req: Request, res: Response) {
    const job = await addJobToQueue({ type: 'StartJob', sub: String(req.params.sub) });

    const queueEvents = new QueueEvents('mainQueue', {
        connection: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT)
        }
    })

    job.waitUntilFinished(queueEvents).then((result) => {
        if (isNaN(result))
            return res.status(200).send(result);
        else {
            if (result === 404)
                return res.status(result).send({ msg: `ERROR: Subreddit r/${req.params.sub} does not exist (${result})`, statusCode: result });
            else if (result === 403)
                return res.status(result).send({ msg: `ERROR: r/${req.params.sub} is a private community. (${result}).`, statusCode: result });
            else
                return res.status(500).send({ msg: 'There was an error in your request (500)', statusCode: 500 });
        }
    }); 
    
}

export async function startJob(sub: string) {
    const job = await getJob(sub);

    if (!job || new Date().getTime() - job.lastUpdated.getTime() >= 10) { // 10800000 = 3h
        const latestPostName = await getLatestPostName(sub);
        let postData = await fetchAllHotPosts(sub, latestPostName);
        let subData: any = await fetchSubMetadata(sub);
        subData = removeUserRelatedData(subData.toJSON());

        if (postData && postData.length > 0) {
            await insertPosts(JSON.parse(JSON.stringify(postData)));
        } else if (!latestPostName) {
            return 404;
        }

        await upsertSub(sub, subData);
        await upsertJob(sub);
    }

    return getPosts(sub);
}

function removeUserRelatedData(sub: Snoowrap.Subreddit) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json: any = sub;

    delete json.user_is_banned;
    delete json.user_can_flair_in_sr;
    delete json.user_is_muted;
    delete json.user_can_flair_in_sr;
    delete json.user_flair_richtext;
    delete json.user_has_favorited;
    delete json.user_flair_template_id;
    delete json.user_is_subscriber;
    delete json.user_is_moderator;
    delete json.user_is_contributor;
    delete json.user_flair_background_color;
    delete json.user_sr_theme_enabled;
    delete json.user_sr_flair_enabled;
    delete json.user_flair_enabled_in_sr;
    delete json.submit_text;
    delete json.user_flair_css_class;
    delete json.user_flair_position;
    delete json.user_flair_text;
    delete json.user_flair_text_color;
    delete json.user_flair_type;

    return json;
}