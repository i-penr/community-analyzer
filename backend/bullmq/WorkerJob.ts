export interface StartJob {
    type: 'StartJob',
    sub: string
}

export interface GetJob {
    type: 'Get',
    data: object
}

export type WorkerJob =
    | StartJob
    | GetJob;