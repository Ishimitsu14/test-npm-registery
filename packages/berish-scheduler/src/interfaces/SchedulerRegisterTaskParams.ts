export interface SchedulerRegisterParams<Data> {
  every?: number;
  cron?: string;
  data?: Data;
}
