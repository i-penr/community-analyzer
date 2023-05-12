import { Job } from "bullmq";

module.exports = {
    name: 'failed',
    async execute(job: Job, failedReason: string) {
        console.error(`Job ${job.id} encountered an error`);
    }
}