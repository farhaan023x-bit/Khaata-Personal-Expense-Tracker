import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await api.post("/api/v1/users/logout").catch(() => {});
      } catch {
        // Proceed with client cleanup
      } finally {
        logout();
        addToast("You have been signed out.", "info");
        navigate("/login");
      }
    };

    performLogout();
  }, [logout, navigate, addToast]);

  return (
    <div className="auth-page-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div className="header-icon-badge">
          <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
            <path d="M12 1L2 6v2h20V6L12 1zm-7 8v9h3V9H5zm5 0v9h4V9h-4zm6 0v9h3V9h-3zM2 20v2h20v-2H2z" />
          </svg>
        </div>
        <h2 className="auth-title" style={{ marginTop: "12px" }}>Signing Out...</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "8px", fontSize: "14px" }}>
          Clearing your session securely. Redirecting to login...
        </p>
      </div>
    </div>
  );
}

export default Logout;
