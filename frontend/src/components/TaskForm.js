import { useState } from "react";
import { useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";
import { addTask } from "../services/api.js";
import { addTaskLocal } from "../redux/taskSlice.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/theme.css";

const TaskForm = ({ userId }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const token = await user.getIdToken();
      const newTask = { userId, title, priority, completed: false };
      const addedTask = await addTask(newTask, token);
      dispatch(addTaskLocal(addedTask));
      setTitle("");
    } catch (error) {
      console.error(
        "Error adding task:",
        error.response ? error.response.data : error
      );
    }
  };

  return (
    <>
      <h4 className="text-center mb-3 newtask">Add New Task</h4>
      <form onSubmit={handleSubmit} className="task-form mt-3">
        <div className="d-flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            className="form-control mb-2 w-75"
            required
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="form-select mb-2 w-25"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary w-50">
            Add Task
          </button>
        </div>
      </form>
    </>
  );
};

export default TaskForm;
