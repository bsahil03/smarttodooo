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
      alert("Please sign in to add tasks");
      return;
    }
  
    try {
      const token = await user.getIdToken();
      const newTask = { 
        userId: user.uid, 
        title: title.trim(), 
        priority, 
        completed: false 
      };
      
      const addedTask = await addTask(newTask, token);
      dispatch(addTaskLocal(addedTask));
      setTitle("");
    } catch (error) {
      console.error("Full error:", error);
      
      // Extract backend error message if available
      const backendMessage = error.response?.data?.error || 
                           error.response?.data?.message;
      
      const errorMessage = backendMessage || 
                          error.message || 
                          "Failed to add task. Please try again.";
      
      alert(errorMessage);
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
