export enum TaskScheduleType {
  Once,
  Plain
}

export interface TaskScheduleOnce {
  type: TaskScheduleType.Once;
  due: string;
}

export interface TaskSchedulePlain {
  type: TaskScheduleType.Plain;
}

export type TaskSchedule = TaskScheduleOnce | TaskSchedulePlain;

export interface Task {
  name: string;
  schedule: TaskSchedule;
}

export interface TasksState {
  items: {
    [key: string]: Task;
  };
}

export enum TasksAction {
  SCHEDULE_TASK = "SCHEDULE_TASK",
  DELETE_TASK = "DELETE_TASK"
}

interface ScheduleTaskAction {
  type: typeof TasksAction.SCHEDULE_TASK;
  id: string;
  task: Task;
}

interface DeleteTaskAction {
  type: typeof TasksAction.DELETE_TASK;
  id: string;
}

export type TasksActionType = ScheduleTaskAction | DeleteTaskAction;
