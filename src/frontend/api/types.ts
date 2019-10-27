export class APIError extends Error {}
export interface Task {
  id: number;
  name: string;
  schedule: {
    type: "Plain";
  };
}
