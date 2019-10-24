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

export interface TaskQuery {
  query?: string;
  after?: string;
  limit: number;
}

interface TaskQueryOk {
  result: "ok";
  items: string[];
  fetched: string;
}

interface TaskQueryFetching {
  result: "fetching";
  started: string;
}

interface TaskQueryError {
  result: "error";
  error: string;
  fetched: string;
}

export type TaskQueryResult = TaskQueryOk | TaskQueryFetching | TaskQueryError;

export interface TasksState {
  items: {
    [key: string]: Task;
  };
  queries: {
    [key: string]: TaskQueryResult;
  };
}

export enum TasksAction {
  SCHEDULE_TASK = "SCHEDULE_TASK",
  DELETE_TASK = "DELETE_TASK",
  TASKS_FETCH_START = "TASKS_FETCH_START",
  TASKS_FETCH_OK = "TASKS_FETCH_OK",
  TASKS_FETCH_ERROR = "TASKS_FETCH_ERROR"
}

interface ScheduleTaskAction {
  type: TasksAction.SCHEDULE_TASK;
  id: string;
  task: Task;
}

interface DeleteTaskAction {
  type: TasksAction.DELETE_TASK;
  id: string;
}

interface TaskFetchStartAction {
  type: TasksAction.TASKS_FETCH_START;
  query: TaskQuery;
  started: string;
}

interface TaskFetchOkAction {
  type: TasksAction.TASKS_FETCH_OK;
  query: TaskQuery;
  results: { [key: string]: Task };
  fetched: string;
}

interface TaskFetchErrorAction {
  type: TasksAction.TASKS_FETCH_ERROR;
  query: TaskQuery;
  error: string;
  fetched: string;
}

export type TasksActionType =
  | ScheduleTaskAction
  | DeleteTaskAction
  | TaskFetchOkAction
  | TaskFetchStartAction
  | TaskFetchErrorAction;
