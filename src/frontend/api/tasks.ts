import { DateTime } from "luxon";

export interface Task {
  id: number;
  name: string;
  due: DateTime;
}

const tasks: Task[] = [...Array(5).keys()].map(n => ({
  id: n,
  name: `Task ${n}`,
  due: DateTime.local().plus({ weeks: n })
}));

export const getTasks = async (): Promise<Task[]> =>
  new Promise<Task[]>((resolve, reject) =>
    setTimeout(() => resolve(tasks), 3000)
  );

export const schedule = async (task: Omit<Task, "id">): Promise<Task> =>
  new Promise<Task>((resolve, reject) =>
    setTimeout(() => {
      const id = Math.max(...tasks.map(t => t.id)) + 1;
      tasks[id] = { ...task, id };
      resolve(tasks[id]);
    }, 3000)
  );

export const unschedule = async (taskId: number): Promise<void> =>
  new Promise<void>((resolve, reject) =>
    setTimeout(() => {
      delete tasks[taskId];
    }, 3000)
  );
