import { APIError, Task } from "./types";

export const getTasks = async (
  limit: number = 10,
  offset: number = 0
): Promise<{ items: Task[]; count: number }> => {
  const url = new URL("tasks", API_URL);
  url.searchParams.set("limit", limit.toString());
  url.searchParams.set("offset", offset.toString());

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new APIError("Task fetch failed");
  }

  const json = await response.json();
  if (!Number.isSafeInteger(json.count) || !Array.isArray(json.tasks)) {
    throw new APIError("Invalid response from server.");
  }
  const count: number = json.count;
  const items: Task[] = (json.tasks as any[]).map((t) => {
    if (
      typeof t !== "object" ||
      !Number.isSafeInteger(t.id) ||
      typeof t.name !== "string"
    ) {
      throw new APIError("Invalid response from server.");
    }

    return {
      id: t.id,
      name: t.name,
      schedule: { type: "Plain" },
    };
  });

  return { items, count };
};
