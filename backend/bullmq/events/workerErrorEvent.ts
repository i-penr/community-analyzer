module.exports = {
    name: 'error',
    async execute(failedReason: Error) {
        console.error(`Job encountered an error: `, failedReason);
    }
}