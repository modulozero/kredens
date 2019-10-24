import { all, call, put, takeEvery } from "redux-saga/effects";
import { getTasks, Task as APITask } from "../api/tasks";
import { taskFetchError, taskFetchOk, taskFetchStart } from "./tasks/actions";
import { Task, TaskQuery, TaskScheduleType } from "./tasks/types";

export function* fetchTasksSaga(query: TaskQuery = { limit: 10 }) {
  yield put(taskFetchStart(query));

  try {
    const tasks: APITask[] = yield call(getTasks);
    yield put(
      taskFetchOk(
        query,
        tasks
          .map<[string, Task]>(t => [
            t.id.toString(),
            {
              name: t.name,
              schedule: {
                type: TaskScheduleType.Once,
                due: t.due.toISO()
              }
            }
          ])
          .reduce((res, [id, task]) => ({ ...res, [id]: task }), {})
      )
    );
  } catch (error) {
    yield put(taskFetchError(query, `${error}`));
  }
}

export default function* rootSaga() {
  yield all([yield takeEvery("FETCH_TASKS", fetchTasksSaga)]);
}
