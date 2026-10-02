import { useState } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

function ExpenseForm({ onExpenseAdded }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!title.trim() || !amount || !category.trim()) {
      addToast("Please fill in Title, Amount, and Category.", "error");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      addToast("Amount must be a positive number greater than 0.", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/v1/expenses/addExpense", {
        title: title.trim(),
        amount: numAmount,
        category: category.trim(),
        description: description.trim(),
      });

      addToast("Payment recorded successfully.", "success");
      handleClear();
      if (onExpenseAdded) {
        await onExpenseAdded();
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to record payment. Please try again.";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setDescription("");
  };

  return (
    <div className="expense-form-card">
      <form onSubmit={handleAddExpense}>
        <div className="expense-form-title">
          <span className="plus-badge">+</span>
          <span>New Transaction</span>
        </div>

        <div className="form-group" style={{ marginBottom: "14px" }}>
          <label htmlFor="exp-title">Title</label>
          <input
            id="exp-title"
            type="text"
            className="form-input"
            value={title}
            placeholder="e.g. Groceries, Studio Rent, Flight"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: "14px" }}>
          <label htmlFor="exp-amount">Amount (₹)</label>
          <input
            id="exp-amount"
            type="number"
            step="0.01"
            min="0.01"
            className="form-input"
            value={amount}
            placeholder="0.00"
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: "14px" }}>
          <label htmlFor="exp-category">Sector / Category</label>
          <input
            id="exp-category"
            type="text"
            className="form-input"
            value={category}
            placeholder="e.g. Housing, Dining, Groceries"
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: "18px" }}>
          <label htmlFor="exp-description">Note (Optional)</label>
          <input
            id="exp-description"
            type="text"
            className="form-input"
            value={description}
            placeholder="Additional context or tag"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Recording..." : "Record Payment"}
          </button>
          <button type="button" className="btn-secondary" onClick={handleClear} disabled={loading}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;