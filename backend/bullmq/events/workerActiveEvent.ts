import { Job } from "bullmq";

module.exports = {
    name: 'active',
    async execute(job: Job) {
        console.debug(`Job ${job.id} is now active.`);
    }
}