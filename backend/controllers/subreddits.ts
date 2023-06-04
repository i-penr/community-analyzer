/* eslint-disable @typescript-eslint/no-explicit-any */
import conn from '../db/db';
import snoo from '../snoowrap/startConn';
import { Db, ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import Snoowrap from 'snoowrap';
import { getIndividualSub } from '../db/subQueries';

let db: Db;


// POST
export async function insertSub(req: Request, res: Response) {
    db = conn.getDb();
    const sub: string = req.params.sub;
    
    snoo.getSubreddit(sub).fetch().then((sub) => {
        sub = removeUserRelatedData(sub.toJSON());

        db.collection('subs').insertOne(sub).then((result) => {
        res.status(200).send(result);
       }).catch((err) => {
        console.log(err);
        res.status(500).send({ err: 'Unable to insert subreddit (duplicated?)' });
       });
    }).catch((err) => {
        if (err instanceof TypeError) {
            return res.status(404).send({ err: err.message });
        } else return res.status(500).send({ err: 'There was an error finding that subreddit' });
    });
}


// GET
export async function getSubs(req: Request, res: Response) {
    db = conn.getDb();

    db.collection('subs').find({}).toArray().then((subs) => {
        res.status(200).send(subs);
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ err: 'Unable to find documents' });
    });
}

export async function getSubByName(req: Request, res: Response) {
    const data = await getIndividualSub(req.params.sub);

    if (!data) {
        return res.status(404).send({ msg: 'Sub not in db' });
    } 

    return res.status(200).send(data);
}


// DELETE
export async function deleteAllSubs(req: Request, res: Response) {
    db = conn.getDb();

    db.collection('subs').deleteMany({}).then((result) => {
        res.status(200).send({ msg: `Deleted ${result.deletedCount} items` });
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ err: err });
    });
}

export async function deleteSubById(req: Request, res: Response) {
    const id = req.params.id;

    if (ObjectId.isValid(id)) {
        db.collection('subs').deleteOne({ _id: new ObjectId(id) }).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).send({ err: 'ID not valid' });
        });
    }
}

export async function deleteSubByName(req: Request, res: Response) {
    const name = req.params.name;

    conn.getDb().collection('subs').deleteOne({ display_name: name }).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ err: 'Cannnot delete' });
    });
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