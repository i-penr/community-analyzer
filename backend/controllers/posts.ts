import conn from '../db/db';
import snoo from '../snoowrap/startConn';
import { Db, ObjectId } from 'mongodb';
import { Request, Response } from 'express';

let db: Db;


// POST
export async function insertPosts(req: Request, res: Response) {
    db = conn.getDb();
    const sub: string = req.params.sub;
    const limit = Number(req.params.limit);

    const hottest = JSON.parse(JSON.stringify(await snoo.getSubreddit(sub).getHot({ limit: limit })));

    db.collection('posts').insertMany(hottest).then((result) => {
        res.status(201).send(result);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ err: 'Unable to insert post' });
    });
}

export async function insertAllPosts(req: Request, res: Response) {
    db = conn.getDb();
    const sub = req.params.sub;

    const hottest = JSON.parse(JSON.stringify(await fetchAllHotPosts(sub)));
    
    db.collection('posts').insertMany(hottest).then((result) => {
        res.status(201).send(result);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ msg: 'Unable to insert post', err: err });
    });
}

// GET
export async function getPosts(req: Request, res: Response) {
    db = conn.getDb();

    db.collection('posts').find({}).toArray().then((posts) => {
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


export async function fetchAllHotPosts(sub: string) {
    return (await snoo.getSubreddit(sub).getHot()).fetchAll({ amount: 0, append: true });
}