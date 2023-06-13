/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import Snoowrap from 'snoowrap';
import { getIndividualSub } from '../db/subQueries';

export async function getSubByName(req: Request, res: Response) {
    const data = await getIndividualSub(req.params.sub);

    if (!data) {
        return res.status(404).send({ msg: 'Sub not in db' });
    } 

    return res.status(200).send(data);
}

export function removeUserRelatedData(sub: Snoowrap.Subreddit) {
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