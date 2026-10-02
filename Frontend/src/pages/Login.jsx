import { useState } from "react";
import api from "../services/api";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/v1/users/login", {
        email,
        password,
      });

      const token = response.data.accessToken;
      if (token) {
        login(token);
        addToast("Welcome back! Successfully signed in.", "success");
        const destination = location.state?.from?.pathname || "/dashboard";
        navigate(destination, { replace: true });
      } else {
        addToast("Login succeeded but no access token was returned.", "error");
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Invalid credentials. Please verify your email and password.";
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
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle-text">Sign in to your private financial workspace</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              placeholder="name@domain.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={password}
              placeholder="••••••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
            <span>{loading ? "Authenticating..." : "Sign In"}</span>
            <span>→</span>
          </button>

          <div className="auth-switch-link">
            Don&apos;t have an account yet? <Link to="/register">Create one here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;