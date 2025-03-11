import { createContext, useState } from "react";
import { getTasks } from "../services/api.js";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async (userId) => {
    if (!userId) return;
    try {
      const data = await getTasks(userId);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
