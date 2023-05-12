export interface StartJob {
    type: 'StartJob',
    sub: string
};

export interface GetJob {
    type: 'Get',
    data: { }
};

export type WorkerJob =
    | StartJob
    | GetJob;