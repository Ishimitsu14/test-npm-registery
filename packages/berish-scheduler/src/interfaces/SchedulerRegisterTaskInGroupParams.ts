import { SchedulerRegisterParams } from './SchedulerRegisterTaskParams';

export interface SchedulerRegisterGroupParams<Data> extends SchedulerRegisterParams<Data> {
  key: string;
}
