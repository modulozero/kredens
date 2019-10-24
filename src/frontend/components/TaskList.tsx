import { AppState } from "@kredens/frontend/store";
import { deleteTask, scheduleTask } from "@kredens/frontend/store/tasks/actions";
import { Task, TaskScheduleType } from "@kredens/frontend/store/tasks/types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default () => {
  const [taskName, setTaskName] = useState("");
  const tasks = useSelector<AppState, { [key: string]: Task }>(state => state.tasks.items);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({type: "FETCH_TASKS"});
  }, [])

  const onTaskAddClick = () => {
    dispatch(scheduleTask(Math.random().toString(36), {
      name: taskName,
      schedule: { type: TaskScheduleType.Plain }
    }))
  };

  const onTaskDeleteClick = (id: string) => {
    dispatch(deleteTask(id))
  };

  return (
    <>
      <ul>
        {
          Object.entries(tasks).map(([id, task]) => (
            <li key={id}>{task.name} <button onClick={() => onTaskDeleteClick(id)}>Delete</button></li>
          ))
        }
      </ul>
      <input value={taskName} onChange={ev => setTaskName(ev.target.value)} />
      <button onClick={onTaskAddClick}>Add!</button>
    </>
  );
}
