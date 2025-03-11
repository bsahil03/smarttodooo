import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { setUser } from "../redux/authSlice";
import "../styles/auth.css"; // Import custom styles

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Separate state for input errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({ userId: user.uid, email: user.email }));
        navigate("/"); // Redirect only after login
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Invalid email format.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage({
          type: "success",
          text: "Registration successful! Please log in.",
        });
        setIsRegistering(false); // ✅ Switch to login mode without redirecting
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setMessage({ type: "success", text: "Logged in successfully!" });
        dispatch(setUser({ userId: userCredential.user.uid, email }));
        setTimeout(() => navigate("/"), 1500); // ✅ Redirect to home page after login
      }
    } catch (error) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setMessage({ type: "error", text: "Invalid email or password." });
      } else if (error.code === "auth/email-already-in-use") {
        setMessage({ type: "error", text: "Email already in use." });
      } else {
        setMessage({ type: "error", text: error.message });
      }
    }
  };

  return (
    <div className="auth-container">
      <h2 className="text-center">{isRegistering ? "Register" : "Login"}</h2>
      {message.text && (
        <p className={`message ${message.type}`}>{message.text}</p>
      )}
      <form onSubmit={handleAuth} className="form-group">
        <input
          type="email"
          placeholder="Email"
          className={`form-control ${emailError ? "input-error" : ""}`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          required
        />
        {emailError && <p className="error-text">{emailError}</p>}

        <input
          type="password"
          placeholder="Password"
          className={`form-control ${passwordError ? "input-error" : ""}`}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
          }}
          required
        />
        {passwordError && <p className="error-text">{passwordError}</p>}

        {isRegistering && (
          <>
            <input
              type="password"
              placeholder="Confirm Password"
              className={`form-control ${
                confirmPasswordError ? "input-error" : ""
              }`}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError("");
              }}
              required
            />
            {confirmPasswordError && (
              <p className="error-text">{confirmPasswordError}</p>
            )}
          </>
        )}

        <button type="submit" className="btn btn-block">
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <p className="text-center">
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => {
            setIsRegistering(!isRegistering);
            setMessage({ type: "", text: "" });
          }}
          className="toggle-link"
        >
          {isRegistering ? "Login" : "Register"}
        </span>
      </p>
    </div>
  );
};

export default Auth;
