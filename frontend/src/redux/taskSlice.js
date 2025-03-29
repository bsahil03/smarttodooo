import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addTask, getTasks, updateTask, deleteTask } from "../services/api.js";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.userId) {
        return rejectWithValue("User not authenticated");
      }
      const response = await getTasks(auth.userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: { 
    tasks: [], 
    loading: false,
    error: null
  },
  reducers: {
    addTaskLocal: (state, action) => {
      state.tasks.unshift(action.payload); // Add new tasks at beginning
    },
    removeTaskLocal: (state, action) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    },
    toggleTaskCompleteLocal: (state, action) => {
      const task = state.tasks.find((task) => task._id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
      }
    },
    updateTaskLocal: (state, action) => {
      const { taskId, updatedData } = action.payload;
      const task = state.tasks.find((task) => task._id === taskId);
      if (task) {
        Object.assign(task, updatedData);
        task.updatedAt = new Date().toISOString();
      }
    },
    clearTasks: (state) => {
      state.tasks = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addTaskLocal,
  removeTaskLocal,
  toggleTaskCompleteLocal,
  updateTaskLocal,
  clearTasks,
} = taskSlice.actions;

export const selectTasks = (state) => state.tasks.tasks;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;

export default taskSlice.reducer;