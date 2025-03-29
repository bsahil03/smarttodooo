import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/taskSlice.js";
import TaskItem from "./TaskItem.js";
import "../styles/tasks.css";

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const auth = useSelector((state) => state.auth);
  const userId = auth?.userId || null;

  useEffect(() => {
    if (userId) {
      dispatch(fetchTasks(userId));
    }
  }, [dispatch, userId]);

  if (loading) {
    return <p className="text-center loadingtask">Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-center error-message">Error: {error}</p>;
  }

  if (!tasks || tasks.length === 0) {
    return <p className="text-center taskavailable">No tasks available.</p>;
  }

  return (
    <div className="task-container">
      {tasks.map((task) => {
        const taskId = task._id || task.id; // Handle both _id and id
        if (!taskId) {
          console.error('Task missing identifier:', task);
          return null;
        }
        return <TaskItem key={taskId} task={{ ...task, _id: taskId }} />;
      })}
    </div>
  );
};

export default TaskList;