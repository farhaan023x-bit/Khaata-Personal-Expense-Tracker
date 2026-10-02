import { useEffect } from "react";

function LogoutModal({ isOpen, onClose, onConfirm }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="logout-title">
      <div className="modal-card logout-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-badge-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>

        <h3 id="logout-title" className="modal-title">Sign Out Confirmation</h3>
        <p className="modal-subtitle">
          Are you sure you want to sign out of your account? You will need to log back in to manage your budget and expenses.
        </p>

        <div className="modal-actions">
          <button type="button" className="btn-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-modal-confirm" onClick={onConfirm}>
            Yes, Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
