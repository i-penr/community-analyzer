import { Request, Response } from "express";
import { getSubscriberDataFromDb } from "../db/subscribersQueries";


export async function getSubscriberData(req: Request, res: Response) {
    const keywords = await getSubscriberDataFromDb(req.params.sub);

    if (!keywords || keywords.length === 0) {
        return res.status(404).send({ msg: 'There is no subscriber growth data.' });
    }
    
    return res.status(200).send(keywords);
}