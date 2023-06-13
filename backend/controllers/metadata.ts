import { Request, Response } from "express";
import { countAllPosts } from "../db/postQueries";
import { countAllSubs } from "../db/subQueries";

export async function getMetadata(req: Request, res: Response) {
    const numPosts = await countAllPosts();
    const numSubs = await countAllSubs();

    
    return res.status(200).send({ "numPosts": numPosts, "numSubs": numSubs });
}