import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// Clean Bespoke SVG Category Icons (Minimalist-UI Directive: No Emojis)
function CategoryIcon({ category }) {
  const cat = (category || "").toString().toLowerCase().trim();

  if (cat.includes("grocer") || cat.includes("food")) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
    );
  }

  if (cat.includes("dining") || cat.includes("restaurant") || cat.includes("cafe") || cat.includes("coffee")) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line>
        <line x1="10" y1="1" x2="10" y2="4"></line>
        <line x1="14" y1="1" x2="14" y2="4"></line>
      </svg>
    );
  }

  if (cat.includes("rent") || cat.includes("house") || cat.includes("housing") || cat.includes("home")) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    );
  }

  if (cat.includes("transport") || cat.includes("travel") || cat.includes("car") || cat.includes("transit") || cat.includes("flight")) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    );
  }

  if (cat.includes("software") || cat.includes("cloud") || cat.includes("tech") || cat.includes("sub")) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    );
  }

  if (cat.includes("health") || cat.includes("medical") || cat.includes("fitness")) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    );
  }

  if (cat.includes("util") || cat.includes("electric") || cat.includes("bill")) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    );
  }

  // Default Tag Icon
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
      <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
  );
}

function Dashboard() {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [expense, setExpense] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categorySummary, setCategorySummary] = useState([]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Deletion state for custom modal
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [editData, setEditData] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
  });

  const getExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/expenses/getExpense", {
        params: {
          page: page,
          limit: 6,
        },
      });

      const calculatedTotalPages = Math.ceil((response.data.totalExpenses || 0) / 6);
      setTotalPages(calculatedTotalPages || 1);
      setExpense(response.data.allExpenses || []);
    } catch (error) {
      if (isAuthenticated) {
        console.warn("Expense fetch issue:", error.response?.data?.message || error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, isAuthenticated]);

  const getSummary = useCallback(async () => {
    try {
      const response = await api.get("/api/v1/expenses/summary");
      setTotalExpense(response.data.totalExpense || 0);
      setCategorySummary(response.data.categorySummary || []);
    } catch (error) {
      console.warn("Summary fetch error:", error.response?.data || error.message);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getExpenses();
    getSummary();
  }, [getExpenses, getSummary]);

  const confirmDeleteExpense = async () => {
    if (!deleteConfirmId) return;

    try {
      await api.delete(`/api/v1/expenses/deleteExpense/${deleteConfirmId}`);
      addToast("Expense record removed.", "info");
      setDeleteConfirmId(null);
      getExpenses();
      getSummary();
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to delete expense.", "error");
    }
  };

  const handleEdit = async (expenseId) => {
    try {
      await api.put(`/api/v1/expenses/updateExpense/${expenseId}`, editData);
      addToast("Expense updated successfully.", "success");
      setEditId(null);
      getExpenses();
      getSummary();
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to update expense.", "error");
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  // Filtered expense list by search term and category
  const filteredExpenses = useMemo(() => {
    return expense.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory =
        selectedCategory === "all" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [expense, searchTerm, selectedCategory]);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Clean Architectural Header Area */}
        <header className="dashboard-header-area">
          <div className="header-left">
            <div className="header-icon-badge">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12 2L3 9l3 1.5L12 6l6 4.5 3-1.5-9-7zm0 7.5L5 15l2 1.5 5-3.8 5 3.8 2-1.5-7-5.5zM12 17l-4 3 1.5 1.5L12 20l2.5 1.5L16 20l-4-3z" />
              </svg>
            </div>
            <div>
              <h1 className="dashboard-main-title">Financial Ledger</h1>
              <p className="dashboard-subtitle">Monitor, allocate, and optimize monthly capital</p>
            </div>
          </div>

          <div className="header-right-meta">
            <div className="date-badge">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>
                {new Date().toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          {/* Left Column: Quick Add + Month Summary */}
          <aside className="dashboard-sidebar">
            <div>
              <h2 className="sidebar-section-title">Record Payment</h2>
              <ExpenseForm
                onExpenseAdded={async () => {
                  await getExpenses();
                  await getSummary();
                }}
              />
            </div>

            <div>
              <h2 className="sidebar-section-title">Overview</h2>
              <div className="month-summary-card">
                <div className="summary-period">Current Month Outflow</div>
                <div className="summary-stat-row">
                  <div className="summary-stat-label">Total Outflow</div>
                  <div className="summary-stat-value">
                    ₹{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="summary-stat-row">
                  <div className="summary-stat-label">Recorded Entries</div>
                  <div className="summary-stat-value" style={{ fontSize: "17px", fontFamily: "var(--font-mono)" }}>
                    {expense.length} on active page
                  </div>
                </div>
                <div className="summary-tip">
                  <span>Aim to maintain discretionary expenses within 30% of total outflow for healthy capital reserves.</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Monthly Budget (Categories) & Expenses List */}
          <main className="dashboard-main">
            {/* Categories Section */}
            <section className="dashboard-section">
              <div className="main-section-header">
                <div className="section-title-wrap">
                  <h2 className="main-section-title">Category Proportions</h2>
                  <span className="section-badge">Distribution</span>
                </div>
                <span className="category-tag-pill">{categorySummary.length} Sectors Active</span>
              </div>

              {categorySummary.length === 0 ? (
                <div className="empty-state-card">
                  <p>No category expenses recorded yet.</p>
                  <span>Use the Record Payment form to log your first transaction.</span>
                </div>
              ) : (
                <div className="category-cards-grid">
                  {categorySummary.map((item) => {
                    const percent =
                      totalExpense > 0 ? Math.round((item.total / totalExpense) * 100) : 0;

                    return (
                      <div className="category-card" key={item._id}>
                        <div>
                          <div className="category-card-top">
                            <span className="category-card-icon">
                              <CategoryIcon category={item._id} />
                            </span>
                            <span className="category-card-name">{item._id}</span>
                          </div>
                          <div className="category-card-amount">
                            ₹{Number(item.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>

                        <div className="category-card-bottom">
                          <span className="category-card-percent">{percent}%</span>
                          <svg className="category-progress-ring" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="var(--border-color)"
                              strokeWidth="4"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="var(--text-primary)"
                              strokeWidth="4"
                              strokeDasharray={`${percent}, 100`}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Expenses List Section */}
            <section className="dashboard-section">
              <div className="main-section-header">
                <div className="section-title-wrap">
                  <h2 className="main-section-title">Ledger Transactions</h2>
                  <span className="section-badge">History</span>
                </div>
              </div>

              {/* Filters Bar: Search & Filter Chips */}
              <div className="expenses-filter-bar">
                <div className="search-input-box">
                  <span className="search-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Filter by description or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-input"
                  />
                  {searchTerm && (
                    <button
                      className="clear-search-btn"
                      onClick={() => setSearchTerm("")}
                      title="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="category-filter-select-wrapper">
                  <select
                    className="category-filter-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Sectors</option>
                    {categorySummary.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat._id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expenses Cards Container */}
              <div className="expenses-container">
                {loading ? (
                  <div className="loading-card">
                    <div className="spinner"></div>
                    <p>Fetching ledger records...</p>
                  </div>
                ) : filteredExpenses.length === 0 ? (
                  <div className="empty-state-card">
                    <p>No transactions match your criteria.</p>
                    <span>
                      {expense.length === 0
                        ? "Add your first payment using the form on the left."
                        : "Try clearing your search query or selecting All Sectors."}
                    </span>
                  </div>
                ) : (
                  filteredExpenses.map((item) => (
                    <div className="expense-item" key={item._id}>
                      {editId === item._id ? (
                        <div className="expense-edit-box">
                          <div className="expense-edit-header">
                            <h4>Edit Payment</h4>
                          </div>
                          <div className="expense-edit-grid">
                            <div className="form-group">
                              <label>Title</label>
                              <input
                                type="text"
                                className="form-input"
                                name="title"
                                value={editData.title}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Amount (₹)</label>
                              <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                name="amount"
                                value={editData.amount}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Category</label>
                              <input
                                type="text"
                                className="form-input"
                                name="category"
                                value={editData.category}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Description</label>
                              <input
                                type="text"
                                className="form-input"
                                name="description"
                                value={editData.description}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="expense-edit-actions">
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => handleEdit(item._id)}
                              disabled={!editData.title || !editData.amount || !editData.category}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => setEditId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="expense-view-row">
                          <div className="expense-view-left">
                            <div className="expense-icon-bubble">
                              <CategoryIcon category={item.category} />
                            </div>
                            <div className="expense-details">
                              <div className="expense-view-title-group">
                                <h3 className="expense-title-text">{item.title}</h3>
                                <span className="expense-category-badge">{item.category}</span>
                              </div>
                              {item.description && (
                                <p className="expense-description">{item.description}</p>
                              )}
                              <span className="expense-timestamp">
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleDateString(undefined, {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "Logged"}
                              </span>
                            </div>
                          </div>

                          <div className="expense-view-right">
                            <span className="expense-amount-display">
                              -₹{Number(item.amount).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>

                            <div className="expense-actions">
                              <button
                                type="button"
                                className="btn-edit"
                                onClick={() => {
                                  setEditId(item._id);
                                  setEditData({
                                    title: item.title,
                                    amount: item.amount,
                                    category: item.category,
                                    description: item.description || "",
                                  });
                                }}
                                title="Edit this entry"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="btn-delete"
                                onClick={() => setDeleteConfirmId(item._id)}
                                title="Delete this entry"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              <div className="pagination-wrapper">
                <span className="page-indicator">
                  Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong>
                </span>
                <div className="pagination-controls">
                  <button
                    type="button"
                    className="btn-page"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    className="btn-page"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages || totalPages === 0}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-badge-icon danger">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </div>
            <h3 className="modal-title">Delete Transaction?</h3>
            <p className="modal-subtitle">
              This action cannot be undone. Are you sure you want to permanently delete this expense record from your ledger?
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-delete"
                onClick={confirmDeleteExpense}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
