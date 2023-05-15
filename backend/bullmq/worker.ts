import { Job, Worker, WorkerOptions } from 'bullmq';
import { WorkerJob } from "./WorkerJob";
import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';
import { startJob } from '../controllers/jobs';
dotenv.config();

const workerHandler = async (job: Job<WorkerJob>) => {
    switch (job.data.type) {
        case 'StartJob': {
            try {
                return await startJob(job.data.sub);
            } catch (err: any) {
                if (err.message === '403') {
                    return 403;
                } else { console.log(err); return 500; }
            }
        }
    }
};

const workerOptions: WorkerOptions = {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    },
    autorun: false
};

const worker = new Worker('mainQueue', workerHandler, workerOptions);

// Event handler
const eventsPath: string = path.join(__dirname, 'events');
const eventsFiles: Array<string> = fs.readdirSync(eventsPath).filter(file => file.endsWith('js'));

for (const file of eventsFiles) {
    const filePath: string = path.join(eventsPath, file);
    const event = require(filePath);

    worker.on(event.name, (...args: any) => { event.execute(...args); });
}


export default worker;