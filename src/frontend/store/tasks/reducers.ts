import objectHash from "object-hash";
import { TasksAction, TasksActionType, TasksState } from "./types";

const initialState: TasksState = {
  items: {},
  queries: {}
};

export function tasksReducer(
  state = initialState,
  action?: TasksActionType
): TasksState {
  switch (action.type) {
    case TasksAction.SCHEDULE_TASK:
      return {
        ...state,
        items: {
          ...state.items,
          [action.id]: action.task
        }
      };
    case TasksAction.DELETE_TASK:
      return {
        ...state,
        items: Object.entries(state.items)
          .filter(([key]) => key !== action.id)
          .reduce((res, [key, task]) => ({ ...res, [key]: task }), {})
      };
    case TasksAction.TASKS_FETCH_START:
      return {
        ...state,
        queries: {
          ...state.queries,
          [objectHash(action.query)]: {
            result: "fetching",
            started: action.started
          }
        }
      };
    case TasksAction.TASKS_FETCH_OK:
      return {
        ...state,
        items: {
          ...state.items,
          ...action.results
        },
        queries: {
          ...state.queries,
          [objectHash(action.query)]: {
            result: "ok",
            items: Object.keys(action.results),
            fetched: action.fetched
          }
        }
      };
    case TasksAction.TASKS_FETCH_ERROR:
      return {
        ...state,
        queries: {
          ...state.queries,
          [objectHash(action.query)]: {
            result: "error",
            error: action.error,
            fetched: action.fetched
          }
        }
      };
    default: {
      return state;
    }
  }
}
