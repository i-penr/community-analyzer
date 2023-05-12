import { Job } from "bullmq";

module.exports = {
    name: 'completed',
    async execute(job: Job) {
        console.debug(`Job ${job.id} completed`);
    }
}