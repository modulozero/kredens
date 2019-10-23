import { TasksAction, TasksActionType, TasksState } from "./types";

const initialState: TasksState = {
  items: {}
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
    default: {
      return state;
    }
  }
}
