import conn from '../db/db';
import { Db, ObjectId } from 'mongodb';
import { Request, Response } from 'express';

let db: Db;


// GET
export async function getPosts(req: Request, res: Response) {
    conn.getDb().collection('posts').find({}).toArray().then((posts) => {
        res.status(200).send(posts);
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ err: 'Unable to find documents' });
    });
}

export async function getPostsFromSub(req: Request, res: Response) {
    conn.getDb().collection('posts').find(
        { subreddit: req.params.sub }
    ).collation(
        { locale: 'en', strength: 2 }
    ).toArray().then((posts) => {
        res.status(200).send(posts);
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ err: 'Unable to find documents' });
    });
}

// DELETE
export async function deleteAllPosts(req: Request, res: Response) {
    db = conn.getDb();

    db.collection('posts').deleteMany({}).then((result) => {
        res.status(200).send({ msg: `Deleted ${result.deletedCount} items` });
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ err: err });
    });
}

export async function deletePostById(req: Request, res: Response) {
    const id = req.params.id;

    if (ObjectId.isValid(id)) {
        db.collection('posts').deleteOne({ _id: new ObjectId(id) }).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).send({ err: 'Cannnot delete' });
        });
    }
}