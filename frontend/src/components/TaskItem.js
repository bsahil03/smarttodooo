import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Reset form when task prop changes
  useEffect(() => {
    setNewTitle(task.title);
    setNewPriority(task.priority);
  }, [task]);

  const toggleComplete = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await updateTask(task._id, { completed: !task.completed });
      dispatch(toggleTaskCompleteLocal(task._id));
    } catch (err) {
      console.error("Failed to toggle task:", err);
      setError("Failed to update task status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteTask(task._id);
      dispatch(removeTaskLocal(task._id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  // components/TaskItem.js
const saveUpdate = async () => {
  if (!newTitle.trim()) {
    setError("Title cannot be empty");
    return;
  }

  try {
    setIsLoading(true);
    setError(null);
    await updateTask(task._id, {
      title: newTitle.trim(),
      priority: newPriority,
    });
    dispatch(
      updateTaskLocal({
        taskId: task._id,
        updatedData: {
          title: newTitle.trim(),
          priority: newPriority,
        },
      })
    );
    setIsEditing(false);
  } catch (err) {
    console.error("Failed to update task:", err);
    
    // Handle specific error cases
    if (err.message.includes('ECONNRESET') || err.message.includes('Network Error')) {
      setError("Connection lost. Please check your network and try again.");
    } else {
      setError(err.message || "Failed to save changes");
    }
    
    // Optionally retry automatically after delay
    setTimeout(() => {
      if (window.confirm("Update failed. Would you like to try again?")) {
        saveUpdate();
      }
    }, 2000);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelDelete}
                  disabled={isLoading}
                />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this task?</p>
                <p className="fw-bold">"{task.title}"</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelDelete}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Item */}
      <div
        className={`task-item d-flex align-items-center justify-content-between mt-2 ${
          isLoading ? "opacity-50" : ""
        }`}
      >
        <div className="d-flex align-items-center gap-2 flex-grow-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={toggleComplete}
            disabled={isLoading}
          />

          {isEditing ? (
            <div className="d-flex flex-column flex-grow-1 gap-2">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="form-control"
                disabled={isLoading}
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="form-select"
                disabled={isLoading}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          ) : (
             <span
              className={`flex-grow-1 ${
                task.completed ? "text-decoration-line-through text-muted" : ""
              }`}
              style={{ cursor: "pointer", color: "black" }}
              onClick={toggleComplete}
            >
              {task.title}
              <span
                className={`badge ms-2 priority-${task.priority.toLowerCase()}`}
                style={{ color: "black" }}
              >
                ({task.priority})
              </span>
            </span>
          )}
        </div>

        <div className="d-flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={saveUpdate}
                className="btn btn-success"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                }}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-warning"
                disabled={isLoading}
              >
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="btn btn-danger"
                disabled={isLoading}
              >
                Delete
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="w-100 mt-2 alert alert-danger">
            {error}
            <button
              type="button"
              className="btn-close float-end"
              onClick={() => setError(null)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TaskItem;
