import axios from "axios";
import { auth } from "../firebaseConfig.js";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://smarttodooo.onrender.com/tasks"
    : "http://localhost:5000/tasks";

    const getAuthToken = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn("User not authenticated");
          return null;
        }
        
        const token = await user.getIdToken();
        if (!token) {
          console.warn("No token available");
          return null;
        }
        
        return token;
      } catch (error) {
        console.error("Error getting auth token:", error);
        return null;
      }
    };

// services/api.js
const apiRequest = async (method, url, data = undefined, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("No authentication token available");

      const config = {
        method,
        url: `${API_URL}${url}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      };

      if (data) config.data = data;

      const response = await axios(config);
      
      if (response.status >= 400) {
        const error = new Error(response.data?.message || `Request failed with status ${response.status}`);
        error.response = response;
        throw error;
      }

      return response.data;
    } catch (error) {
      if (i === retries - 1 || error.code !== 'ECONNRESET') {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message;
        console.error(`❌ API request failed (${method} ${url}):`, errorMessage);
        throw new Error(errorMessage);
      }
      // Exponential backoff before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
export const addTask = async (task) => {
  // Validate task structure before sending
  if (!task || !task.title || !task.priority) {
    throw new Error("Task must have title and priority");
  }
  
  // Ensure priority is one of the expected values
  const validPriorities = ["High", "Medium", "Low"];
  if (!validPriorities.includes(task.priority)) {
    throw new Error("Priority must be High, Medium, or Low");
  }

  return apiRequest("post", "/add", task);
};
// Modify the getTasks function
export const getTasks = async (userId) => {
  const tasks = await apiRequest("get", `/${userId}`);
  // Normalize task IDs in the response
  return tasks.map(task => ({
    ...task,
    _id: task._id || task.id // Ensure _id is always present
  }));
};
export const updateTask = async (taskId, updatedData) =>
  apiRequest("put", `/update/${taskId}`, updatedData);
export const deleteTask = async (taskId) =>
  apiRequest("delete", `/delete/${taskId}`);
