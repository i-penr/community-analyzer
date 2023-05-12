module.exports = {
    name: 'drained',
    async execute() {
        console.error('No jobs left in queue');
    }
}