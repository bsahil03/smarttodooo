import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/taskSlice.js";
import TaskItem from "./TaskItem.js";
import "../styles/tasks.css";

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const auth = useSelector((state) => state.auth);
  const userId = auth?.userId || null;

  useEffect(() => {
    if (userId) {
      dispatch(fetchTasks(userId));
    }
  }, [dispatch, userId]);

  if (loading)
    return <p className="text-center loadingtask">Loading tasks...</p>;
  if (!tasks || tasks.length === 0)
    return <p className="text-center taskavailable">No tasks available.</p>;

  return (
    <div className="task-container">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
