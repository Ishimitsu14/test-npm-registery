export type SchedulerNext = () => Promise<void>;
export type SchedulerWorker = () => Promise<void>;

export type SchedulerAdapterWorker = (data: any) => Promise<void>;
