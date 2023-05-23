import { Job, Worker, WorkerOptions } from 'bullmq';
import { WorkerJob } from "./WorkerJob";
import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';
import { startTask } from '../controllers/mainTask';
dotenv.config();

const workerHandler = async (job: Job<WorkerJob>) => {
    switch (job.data.type) {
        case 'StartJob': {
            try {
                return await startTask(job.data.sub);
            } catch (err: unknown) {
                if ((err as Error).message === '403') {
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const event = require(filePath);

    worker.on(event.name, (...args: unknown[]) => { event.execute(...args); });
}


export default worker;