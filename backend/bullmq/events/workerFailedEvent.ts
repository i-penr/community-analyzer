import { Job } from "bullmq";

module.exports = {
    name: 'failed',
    async execute(job: Job) {
        console.error(`Job ${job.id} encountered an error`);
    }
}