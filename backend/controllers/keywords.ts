import { Request, Response } from "express";
import { getKeywordsFromDb } from "../db/keywordsQueries";

export async function getKeywords(req: Request, res: Response) {
    const keywords = await getKeywordsFromDb(req.params.sub);

    if (keywords.length === 0) {
        return res.status(204).send({ msg: 'There are no keywords.', statusCode: 402 });
    }
    
    return res.status(200).send(keywords);
}