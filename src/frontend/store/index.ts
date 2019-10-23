import { combineReducers, createStore } from "redux";
import { tasksReducer } from "./tasks/reducers";

const rootReducer = combineReducers({
  tasks: tasksReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const store = createStore(rootReducer);

  return store;
}
