import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import LogoutModal from "./LogoutModal";
import api from "../services/api";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLanding = location.pathname === "/";

  const handleConfirmLogout = async () => {
    try {
      await api.post("/api/v1/users/logout").catch(() => {});
    } catch {
      // Proceed client cleanup
    } finally {
      logout();
      setShowLogoutModal(false);
      addToast("Successfully signed out.", "info");
      navigate("/");
    }
  };

  const handleNavAnchor = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (isLanding) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 120);
    }
  };

  return (
    <>
      <div className="navbar-fixed-container">
        <header className="navbar-floating-pill">
          {/* Brand Logo & Geometric Mark */}
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="nav-brand-group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="nav-brand-gem">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2L3 9l3 1.5L12 6l6 4.5 3-1.5-9-7zm0 7.5L5 15l2 1.5 5-3.8 5 3.8 2-1.5-7-5.5zM12 17l-4 3 1.5 1.5L12 20l2.5 1.5L16 20l-4-3z" />
              </svg>
            </div>
            <div className="nav-brand-text">
              <span className="nav-brand-main">Khaata</span>
              <span className="nav-brand-sub">Finance System</span>
            </div>
          </Link>

          {/* Desktop Navigation Links: ONLY shown when NOT logged in */}
          {!isAuthenticated ? (
            <nav className="nav-center-menu" aria-label="Main Navigation">
              <a
                href="#overview"
                className="nav-item-link"
                onClick={(e) => handleNavAnchor(e, "overview")}
              >
                Overview
              </a>
              <a
                href="#simulator"
                className="nav-item-link"
                onClick={(e) => handleNavAnchor(e, "simulator")}
              >
                Demo
              </a>
              <a
                href="#features"
                className="nav-item-link"
                onClick={(e) => handleNavAnchor(e, "features")}
              >
                Architecture
              </a>
              <a
                href="#philosophy"
                className="nav-item-link"
                onClick={(e) => handleNavAnchor(e, "philosophy")}
              >
                Philosophy
              </a>
              <a
                href="#contact"
                className="nav-item-link"
                onClick={(e) => handleNavAnchor(e, "contact")}
              >
                Contact
              </a>
            </nav>
          ) : (
            <div className="nav-center-authenticated">
              <span className="nav-workspace-badge">Personal Ledger</span>
            </div>
          )}

          {/* Right Action Cluster */}
          <div className="nav-right-actions">
            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              className="btn-theme-toggle"
              onClick={toggleTheme}
              title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              aria-label="Toggle color theme"
            >
              {theme === "light" ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>

            {isAuthenticated ? (
              <div className="nav-auth-active-group">
                <Link to="/dashboard" className="btn-nav-dashboard">
                  <span className="nav-active-dot"></span>
                  <span>Dashboard</span>
                </Link>

                <button
                  type="button"
                  className="btn-nav-logout"
                  onClick={() => setShowLogoutModal(true)}
                  title="Sign out of session"
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="nav-guest-actions">
                <Link to="/login" className="nav-item-link nav-login-link">
                  Sign In
                </Link>
                <Link to="/register" className="btn-nav-get-started">
                  <span>Get Started</span>
                  <span className="btn-arrow-chip">→</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              className="btn-mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="nav-mobile-dropdown">
            {!isAuthenticated ? (
              <>
                <a
                  href="#overview"
                  className="mobile-nav-link"
                  onClick={(e) => handleNavAnchor(e, "overview")}
                >
                  Overview
                </a>
                <a
                  href="#simulator"
                  className="mobile-nav-link"
                  onClick={(e) => handleNavAnchor(e, "simulator")}
                >
                  Demo
                </a>
                <a
                  href="#features"
                  className="mobile-nav-link"
                  onClick={(e) => handleNavAnchor(e, "features")}
                >
                  Architecture
                </a>
                <a
                  href="#philosophy"
                  className="mobile-nav-link"
                  onClick={(e) => handleNavAnchor(e, "philosophy")}
                >
                  Philosophy
                </a>
                <a
                  href="#contact"
                  className="mobile-nav-link"
                  onClick={(e) => handleNavAnchor(e, "contact")}
                >
                  Contact
                </a>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                  <Link
                    to="/login"
                    className="btn-secondary"
                    style={{ width: "100%", textAlign: "center" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                    style={{ width: "100%", textAlign: "center" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started →
                  </Link>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link
                  to="/dashboard"
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard Overview →
                </Link>
                <button
                  type="button"
                  className="btn-modal-cancel"
                  style={{ width: "100%" }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout Confirmation Dialog Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}

export default Navbar;