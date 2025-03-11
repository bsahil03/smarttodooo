// app.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home.js";
import Auth from "./pages/Auth.js";
import Navbar from "./components/Navbar";

function App() {
  const authState = useSelector((state) => state.auth) || {};
  const userId = authState?.userId || null;
  const isAuthenticated = authState?.isAuthenticated || false;

  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home userId={userId} />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
