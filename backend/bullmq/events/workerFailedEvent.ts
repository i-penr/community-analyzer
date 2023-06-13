import { Job } from "bullmq";
import { updateJobStatus } from "../../db/jobQueries";

module.exports = {
    name: 'failed',
    async execute(job: Job) {
        updateJobStatus(job.data.sub, 'errored')
        console.error(`Job ${job.id} encountered an error`);
    }
}