import { getTasks } from "@kredens/frontend/api/tasks";
import { Task as APITask } from "@kredens/frontend/api/types";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { taskFetchError, taskFetchOk, taskFetchStart } from "./tasks/actions";
import { Task, TaskQuery, TaskScheduleType } from "./tasks/types";

export function* fetchTasksSaga(query: TaskQuery = { limit: 10 }) {
  yield put(taskFetchStart(query));

  try {
    const tasks: { items: APITask[]; count: number } = yield call(
      getTasks,
      query.limit,
      query.offset
    );
    yield put(
      taskFetchOk(
        query,
        tasks.items
          .map<[string, Task]>(t => [
            t.id.toString(),
            {
              name: t.name,
              schedule: {
                type: TaskScheduleType[t.schedule.type]
              }
            }
          ])
          .reduce((res, [id, task]) => ({ ...res, [id]: task }), {}),
        tasks.count
      )
    );
  } catch (error) {
    yield put(taskFetchError(query, `${error}`));
  }
}

export default function* rootSaga() {
  yield all([yield takeEvery("FETCH_TASKS", fetchTasksSaga)]);
}
