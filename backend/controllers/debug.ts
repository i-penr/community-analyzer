/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import connObj from "../db/db";
import { getLatestPost } from "../db/postQueries";


// ========= JOBS =========
// GET

export async function getJobBySub(req: Request, res: Response) {
    connObj.getDb().collection('jobs').findOne(
        { sub: req.params.sub }
    ).then((result: any) => {
        console.log(result);
        return res.status(200).send(result);
    }).catch(() => {
        return res.status(500).send({ msg: "There was an error finding the job" });
    })
}

export async function getAllJobs(req: Request, res: Response) {
    connObj.getDb().collection('jobs').find().toArray()
        .then((result: any) => {
            console.log(result);
            return res.status(200).send({ "jobs": result, "total": result.length });
        }).catch(() => {
            return res.status(500).send({ msg: "There was an error finding the jobs" });
        })
}

// DELETE

export async function deleteJobBySub(req: Request, res: Response) {
    connObj.getDb().collection('jobs').deleteOne(
        { sub: req.params.sub }
    ).then((result: any) => {
        console.log(result);
        return res.status(200).send({ msg: "Job deleted sucessfully" });
    }).catch(() => {
        return res.status(500).send({ msg: "There was an error deleting the job" });
    })
}

export async function deleteAllJobs(req: Request, res: Response) {
    connObj.getDb().collection('jobs').deleteMany()
        .then((result: any) => {
            console.log(result);
            return res.status(200).send({ msg: "Jobs deleted sucessfully" });
        }).catch(() => {
            return res.status(500).send({ msg: "There was an error deleting the jobs" });
        })
}

// ========= POSTS =========
// GET

export async function getFirstPost(req: Request, res: Response) {
    const sub = req.params.sub;
    const sort = Number(req.params.sort);

    if (sort * sort !== 1)
        return res.status(400).send({ msg: 'Bad request' });

    const post = await getLatestPost(sub, sort as 1 | -1);

    if (!post) {
        return res.status(404).send({ msg: 'Post not found' });
    }

    return res.status(200).send(post);
}

export async function getPostsBySub(req: Request, res: Response) {
    connObj.getDb().collection('posts').find(
        { subreddit: req.params.sub },
        { collation: { locale: 'en', strength: 2 }}
    ).toArray().then((result: any) => {
        console.log(result);
        return res.status(200).send({ "posts": result, "total": result.length });
    }).catch(() => {
        return res.status(500).send({ msg: "There was an error finding the posts" });
    })
}

export async function getAllPosts(req: Request, res: Response) {
    connObj.getDb().collection('posts').find().toArray()
        .then((result: any) => {
            console.log(result);
            return res.status(200).send({ "posts": result, "total": result.length });
        }).catch(() => {
            return res.status(500).send({ msg: "There was an error finding the posts" });
        })
}

// DELETE

export async function deletePostsFromSub(req: Request, res: Response) {
    connObj.getDb().collection('posts').deleteMany(
        { subreddit: req.params.sub },
        { collation: { locale: 'en', strength: 2 }}
    ).then((result: any) => {
        console.log(result);
        return res.status(200).send({ msg: `Posts sucessfully from ${req.params.sub}` });
    }).catch(() => {
        return res.status(500).send({ msg: "There was an error deleting the posts" });
    })
}

export async function deletePostById(req: Request, res: Response) {
    const id = req.params.id;

    if (ObjectId.isValid(id)) {
        connObj.getDb().collection('posts').deleteOne({ _id: new ObjectId(id) }).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).send({ err: 'Cannnot delete' });
        });
    }
}

export async function deleteAllPosts(req: Request, res: Response) {
    connObj.getDb().collection('posts').deleteMany()
        .then((result: any) => {
            console.log(result);
            return res.status(200).send({ msg: "Posts deleted sucessfully" });
        }).catch(() => {
            return res.status(500).send({ msg: "There was an error deleting the posts" });
        })
}

// ========= SUBS =========
// GET

export async function getSubByName(req: Request, res: Response) {
    connObj.getDb().collection('subs').findOne(
        { subreddit: req.params.sub },
        { collation: { locale: 'en', strength: 2 }}
    ).then((result: any) => {
        console.log(result);
        return res.status(200).send({ "subs": result, "total": result.length });
    }).catch(() => {
        return res.status(500).send({ msg: "There was an error finding the sub" });
    })
}

export async function getAllSubs(req: Request, res: Response) {
    connObj.getDb().collection('subs').find().toArray()
        .then((result: any) => {
            console.log(result);
            return res.status(200).send({ "subs": result, "total": result.length });
        }).catch(() => {
            return res.status(500).send({ msg: "There was an error finding the subs" });
        })
}

// DELETE

export async function deleteSubByName(req: Request, res: Response) {
    connObj.getDb().collection('subs').deleteOne(
        { subreddit: req.params.sub },
        { collation: { locale: 'en', strength: 2 }}
    ).then((result: any) => {
        console.log(result);
        return res.status(200).send({ msg: "Subreddit deleted sucessfully" });
    }).catch(() => {
        return res.status(500).send({ msg: "There was an error deleting the sub" });
    })
}

export async function deleteAllSubs(req: Request, res: Response) {
    connObj.getDb().collection('subs').deleteMany()
        .then((result: any) => {
            console.log(result);
            return res.status(200).send({ msg: "Subs deleted sucessfully" });
        }).catch(() => {
            return res.status(500).send({ msg: "There was an error deleting the Subs" });
        })
}

export async function deleteSubById(req: Request, res: Response) {
    const id = req.params.id;

    if (ObjectId.isValid(id)) {
        connObj.getDb().collection('subs').deleteOne({ _id: new ObjectId(id) }).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).send({ err: 'ID not valid' });
        });
    }
}

