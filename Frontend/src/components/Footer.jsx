import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function Footer() {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();
  const contactEmail = "farhaan023x@gmail.com";

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(contactEmail)
      .then(() => {
        setCopied(true);
        addToast("Email copied to clipboard.", "success");
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {
        addToast("Failed to copy email.", "error");
      });
  };

  return (
    <footer id="contact" className="site-footer">
      <div className="landing-container">
        {/* Top Info Grid */}
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-pane">
            <div className="footer-brand-header">
              <div className="footer-gem-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2L3 9l3 1.5L12 6l6 4.5 3-1.5-9-7zm0 7.5L5 15l2 1.5 5-3.8 5 3.8 2-1.5-7-5.5zM12 17l-4 3 1.5 1.5L12 20l2.5 1.5L16 20l-4-3z" />
                </svg>
              </div>
              <span className="footer-brand-title">Khaata</span>
            </div>
            <p className="footer-description">
              Intentional personal finance with quiet, high-precision telemetry. Engineered for clarity, zero spreadsheets, and full capital sovereignty.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-nav-col">
            <div className="footer-col-heading">Platform</div>
            <ul className="footer-links-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <a href="#overview">Overview</a>
              </li>
              <li>
                <a href="#simulator">Demo</a>
              </li>
              <li>
                <a href="#features">Architecture</a>
              </li>
              <li>
                <a href="#philosophy">Philosophy</a>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Engineering */}
          <div className="footer-nav-col">
            <div className="footer-col-heading">Stack</div>
            <ul className="footer-links-list">
              <li><span>React 19</span></li>
              <li><span>Vite 8</span></li>
              <li><span>REST API</span></li>
              <li><span>JWT Sessions</span></li>
              <li><span>Local-First State</span></li>
            </ul>
          </div>

          {/* Contact / Inquiries Card */}
          <div className="footer-contact-card-col">
            <div className="footer-col-heading">Contact & Inquiries</div>
            <p className="footer-contact-hint">
              Have questions, feedback, or need direct support?
            </p>

            <div className="footer-email-box">
              <a href={`mailto:${contactEmail}`} className="email-address-link">
                {contactEmail}
              </a>
              <button
                type="button"
                className={`btn-copy-contact ${copied ? "copied" : ""}`}
                onClick={handleCopyEmail}
                title="Copy email to clipboard"
                aria-label="Copy email address"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-divider-hairline"></div>
        <div className="footer-bottom-meta">
          <div className="footer-copy-text">
            © {new Date().getFullYear()} Khaata.
          </div>
          <div className="footer-tech-chips">
            <span className="tech-chip">Minimalist-UI</span>
            <span className="tech-chip">React 19</span>
            <span className="tech-chip">Clean Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
