import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  toggleTaskCompleteLocal,
  removeTaskLocal,
  updateTaskLocal,
} from "../redux/taskSlice.js";
import { updateTask, deleteTask } from "../services/api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/theme.css";
import "../styles/tasks.css";

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newPriority, setNewPriority] = useState(task.priority);

  const toggleComplete = async () => {
    await updateTask(task._id, { completed: !task.completed });
    dispatch(toggleTaskCompleteLocal(task._id));
  };

  const removeTask = async () => {
    await deleteTask(task._id);
    dispatch(removeTaskLocal(task._id));
  };

  const saveUpdate = async () => {
    await updateTask(task._id, { title: newTitle, priority: newPriority });
    dispatch(
      updateTaskLocal({
        taskId: task._id,
        updatedData: { title: newTitle, priority: newPriority },
      })
    );
    setIsEditing(false);
  };

  return (
    <div className="task-item d-flex align-items-center justify-content-between mt-2">
      <div className="d-flex align-items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggleComplete}
        />
        {isEditing ? (
          <>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="form-control"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="form-select"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </>
        ) : (
          <span
            style={{ textDecoration: task.completed ? "line-through" : "none" }}
          >
            {task.title} ({task.priority})
          </span>
        )}
      </div>
      <div className="d-flex gap-2">
        {isEditing ? (
          <>
            <button onClick={saveUpdate} className="btn btn-success">
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-warning"
            >
              Edit
            </button>
            <button onClick={removeTask} className="btn btn-danger">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
