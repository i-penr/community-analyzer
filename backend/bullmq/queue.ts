import { Queue } from "bullmq";
import { WorkerJob } from "./WorkerJob";
import worker from './worker';
import * as dotenv from 'dotenv';
dotenv.config();

const mainQueue = new Queue('mainQueue', {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
});

worker.run();

export async function addJobToQueue(job: WorkerJob) {
    return mainQueue.add(job.type, job, {
        removeOnComplete: 100,
        removeOnFail: 500
    });
}

export default mainQueue;
