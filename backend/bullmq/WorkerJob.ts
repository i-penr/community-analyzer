export interface DownloadJob {
    type: 'DownloadJob',
    sub: string
}

export interface GetJob {
    type: 'GetJob',
}

export type WorkerJob =
    | DownloadJob
    | GetJob;