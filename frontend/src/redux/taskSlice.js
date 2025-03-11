import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addTask, getTasks, updateTask, deleteTask } from "../services/api.js";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { getState }) => {
    const { auth } = getState();
    if (!auth.userId) throw new Error("User not logged in");
    return await getTasks(auth.userId);
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: { tasks: [], loading: false },
  reducers: {
    addTaskLocal: (state, action) => {
      state.tasks.push(action.payload);
    },
    removeTaskLocal: (state, action) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    },
    toggleTaskCompleteLocal: (state, action) => {
      const task = state.tasks.find((task) => task._id === action.payload);
      if (task) task.completed = !task.completed;
    },
    updateTaskLocal: (state, action) => {
      const { taskId, updatedData } = action.payload;
      const task = state.tasks.find((task) => task._id === taskId);
      if (task) {
        task.title = updatedData.title ?? task.title;
        task.priority = updatedData.priority ?? task.priority;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        console.error("Failed to fetch tasks:", action.error.message);
        state.loading = false;
      });
  },
});

export const {
  addTaskLocal,
  removeTaskLocal,
  toggleTaskCompleteLocal,
  updateTaskLocal,
} = taskSlice.actions;
export default taskSlice.reducer;
