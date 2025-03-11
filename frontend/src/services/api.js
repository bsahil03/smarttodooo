import axios from "axios";
import { auth } from "../firebaseConfig.js";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://smarttodooo.onrender.com/tasks"
    : "http://localhost:5000/tasks";

const getAuthToken = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      if (user) {
        try {
          const token = await user.getIdToken();
          resolve(token);
        } catch (error) {
          console.error("❌ Error getting auth token:", error);
          reject(null);
        }
      } else {
        console.warn("⚠️ User not authenticated");
        reject(null);
      }
    });
  });
};

const apiRequest = async (method, url, data = undefined) => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("❌ No authentication token available");

    const config = {
      method,
      url: `${API_URL}${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (data) config.data = data;

    console.log(`📡 Sending ${method} request to:`, config.url);
    const response = await axios(config);
    console.log(`✅ API response (${method} ${url}):`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `❌ API request failed (${method} ${url}):`,
      error.response?.data || error
    );
    throw error;
  }
};

export const addTask = async (task) => apiRequest("post", "/add", task);
export const getTasks = async (userId) => apiRequest("get", `/${userId}`);
export const updateTask = async (taskId, updatedData) =>
  apiRequest("put", `/update/${taskId}`, updatedData);
export const deleteTask = async (taskId) =>
  apiRequest("delete", `/delete/${taskId}`);
