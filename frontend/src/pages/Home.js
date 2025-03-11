import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import { logoutUser } from "../redux/authSlice.js";
import TaskForm from "../components/TaskForm.js";
import TaskList from "../components/TaskList.js";

const Home = ({ userId }) => {
  const authUserId = useSelector((state) => state.auth.userId);
  const finalUserId = userId || authUserId;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutUser());
      navigate("/auth");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-dark">Smart To-Do List</h1>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
      {finalUserId ? (
        <>
          <TaskForm userId={finalUserId} />
          <TaskList userId={finalUserId} />
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
};

export default Home;
