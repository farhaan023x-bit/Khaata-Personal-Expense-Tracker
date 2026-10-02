import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/v1/users/register", {
        username: username.trim(),
        email: email.trim(),
        password,
      });

      addToast("Account created successfully! Please sign in.", "success");
      navigate("/login");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed. Please check your details.";
      addToast(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-gem-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2L3 9l3 1.5L12 6l6 4.5 3-1.5-9-7zm0 7.5L5 15l2 1.5 5-3.8 5 3.8 2-1.5-7-5.5zM12 17l-4 3 1.5 1.5L12 20l2.5 1.5L16 20l-4-3z" />
            </svg>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle-text">Start tracking your personal cash flow with clarity</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              type="text"
              className="form-input"
              value={username}
              placeholder="e.g. alex_stone"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              value={email}
              placeholder="name@domain.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              value={password}
              placeholder="Choose a secure password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <span>→</span>
          </button>

          <div className="auth-switch-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;