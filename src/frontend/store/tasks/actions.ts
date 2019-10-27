import { DateTime } from "luxon";
import { Task, TaskQuery, TasksAction, TasksActionType } from "./types";

export function scheduleTask(id: string, task: Task): TasksActionType {
  return {
    type: TasksAction.SCHEDULE_TASK,
    id,
    task
  };
}

export function deleteTask(id: string): TasksActionType {
  return {
    type: TasksAction.DELETE_TASK,
    id
  };
}

export function taskFetchStart(query: TaskQuery): TasksActionType {
  return {
    type: TasksAction.TASKS_FETCH_START,
    query,
    started: DateTime.utc().toISO()
  };
}

export function taskFetchOk(
  query: TaskQuery,
  results: { [key: string]: Task },
  count: number
): TasksActionType {
  return {
    type: TasksAction.TASKS_FETCH_OK,
    query,
    results,
    count,
    fetched: DateTime.utc().toISO()
  };
}

export function taskFetchError(
  query: TaskQuery,
  error: string
): TasksActionType {
  return {
    type: TasksAction.TASKS_FETCH_ERROR,
    query,
    error,
    fetched: DateTime.utc().toISO()
  };
}
