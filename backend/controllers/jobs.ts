import { Request, Response } from "express";
import { getAllJobs } from "../db/jobQueries";


export async function getJobs(req: Request, res: Response) {
    const jobs = await getAllJobs(req.params.sub);

    if (jobs.length > 0) {
        return res.status(200).send(jobs);
    } else {
        return res.status(204).send({ msg: "There are no jobs stored" });
    }
}