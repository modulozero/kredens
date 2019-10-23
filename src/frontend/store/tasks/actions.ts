import { Task, TasksAction, TasksActionType } from "./types";

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
