import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Landing() {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const heroHeadlineRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroCtaRef = useRef(null);
  const heroVisualRef = useRef(null);

  // Interactive Live Spend Sandbox (Pre-login experience)
  const [simTransactions, setSimTransactions] = useState([
    { id: 1, title: "Studio Workspace Desk", category: "Housing", amount: 180.0, tag: "home" },
    { id: 2, title: "Organic Market Groceries", category: "Groceries", amount: 64.5, tag: "food" },
    { id: 3, title: "Filter Coffee & Beans", category: "Dining", amount: 14.25, tag: "cafe" },
    { id: 4, title: "Commuter Rail Pass", category: "Transport", amount: 35.0, tag: "transit" },
  ]);
  const [simTitle, setSimTitle] = useState("");
  const [simAmount, setSimAmount] = useState("");
  const [simCategory, setSimCategory] = useState("Dining");

  // Elegant Entry Animation for Headline & Visual
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        heroHeadlineRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 1.0 }
      )
        .fromTo(
          heroSubRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          heroCtaRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          heroVisualRef.current,
          { opacity: 0, y: 28, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 1.1 },
          "-=0.7"
        );
    });

    return () => ctx.revert();
  }, []);

  // Sandbox Totals & Percentages
  const simTotal = useMemo(() => {
    return simTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  }, [simTransactions]);

  const simCategories = useMemo(() => {
    const map = {};
    simTransactions.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, total]) => ({
      name,
      total,
      percentage: Math.round((total / (simTotal || 1)) * 100),
    }));
  }, [simTransactions, simTotal]);

  const handleAddSimItem = (e) => {
    e.preventDefault();
    if (!simTitle.trim() || !simAmount || parseFloat(simAmount) <= 0) {
      addToast("Please provide a valid title and amount.", "error");
      return;
    }

    const newItem = {
      id: Date.now(),
      title: simTitle.trim(),
      category: simCategory,
      amount: parseFloat(simAmount),
      tag: simCategory.toLowerCase(),
    };

    setSimTransactions([newItem, ...simTransactions]);
    setSimTitle("");
    setSimAmount("");
    addToast(`Recorded ₹${newItem.amount.toFixed(2)} in ${newItem.category}.`, "success");
  };

  const handleRemoveSimItem = (id) => {
    setSimTransactions(simTransactions.filter((item) => item.id !== id));
    addToast("Removed entry from sandbox.", "info");
  };

  return (
    <div className="landing-page-root">
      {/* SECTION 1: EDITORIAL HERO (TasteSkill Reference Layout) */}
      <section id="overview" className="landing-hero-section">
        <div className="landing-container">
          <div className="hero-two-column-grid">
            {/* Left Column: Typography & CTAs */}
            <div className="hero-left-col">
              {/* Editorial Headline */}
              <h1 ref={heroHeadlineRef} className="hero-editorial-title">
                Less chaos, <br />
                <em>finances pop.</em>
              </h1>

              {/* Restrained Subtext */}
              <p ref={heroSubRef} className="hero-description-lead">
                A quiet, high-precision personal finance engine. Log expenses in seconds, audit spending sectors, and maintain effortless clarity over your cash flow.
              </p>

              {/* Action Cluster */}
              <div ref={heroCtaRef} className="hero-cta-cluster">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-primary-pill">
                    <span>Enter Khaata Dashboard</span>
                    <span className="btn-icon-circle">→</span>
                  </Link>
                ) : (
                  <Link to="/login" className="btn-primary-pill">
                    <span>Launch Khaata</span>
                    <span className="btn-icon-circle">→</span>
                  </Link>
                )}

                <a href="#simulator" className="btn-secondary-pill">
                  <span>Explore Demo</span>
                </a>
              </div>

              {/* Minimalist Telemetry Pill */}
              <div className="hero-micro-stat-card">
                <div className="micro-stat-indicator">
                  <span className="micro-stat-label">Active Burn Index</span>
                  <span className="micro-stat-val">₹{simTotal.toFixed(2)} monthly sample</span>
                </div>
                <span className="micro-stat-badge">Zero Friction</span>
              </div>
            </div>

            {/* Right Column: Serene Editorial Visual */}
            <div ref={heroVisualRef} className="hero-visual-frame">
              <div className="hero-image-wrapper">
                <img
                  src="/hero-main.jpg"
                  alt="Editorial black-and-white portrait with currency motif"
                  className="hero-featured-photo"
                />
                <div className="hero-photo-floating-pill">
                  <div className="floating-pill-left">
                    <span className="floating-pill-dot"></span>
                    <span>Direct Ledger Continuity</span>
                  </div>
                  <span className="floating-pill-right">End-to-End Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE LIVE DEMO */}
      <section id="simulator" className="landing-section">
        <div className="landing-container">
          <div className="section-header-block">
            <div className="section-eyebrow">LIVE DEMO</div>
            <h2 className="section-main-title">Experience the engine before signing in.</h2>
            <p className="section-subtitle">
              Add transactions below to observe instant mathematical reconciliation and category distribution in real-time.
            </p>
          </div>

          <div className="simulator-document-card">
            <div className="simulator-grid-layout">
              {/* Form Controls */}
              <div className="sim-control-panel">
                <h3 className="sim-panel-title">Add Simulated Entry</h3>
                <form onSubmit={handleAddSimItem} className="sim-form">
                  <div className="form-group">
                    <label htmlFor="sim-title">Description</label>
                    <input
                      id="sim-title"
                      type="text"
                      placeholder="e.g. Studio Rent, Weekly Groceries, Coffee"
                      className="form-input"
                      value={simTitle}
                      onChange={(e) => setSimTitle(e.target.value)}
                    />
                  </div>

                  <div className="sim-form-row">
                    <div className="form-group flex-1">
                      <label htmlFor="sim-amount">Amount (₹)</label>
                      <input
                        id="sim-amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="form-input"
                        value={simAmount}
                        onChange={(e) => setSimAmount(e.target.value)}
                      />
                    </div>

                    <div className="form-group flex-1">
                      <label htmlFor="sim-cat">Category</label>
                      <select
                        id="sim-cat"
                        className="form-select"
                        value={simCategory}
                        onChange={(e) => setSimCategory(e.target.value)}
                      >
                        <option value="Dining">Dining</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Software">Software</option>
                        <option value="Transport">Transport</option>
                        <option value="Housing">Housing</option>
                        <option value="Wellness">Wellness</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                    <span>Record Entry</span>
                    <span>+</span>
                  </button>
                </form>

                {/* Category Progress Breakdown */}
                <div className="sim-breakdown-box">
                  <div className="sim-breakdown-heading">Proportional Allocation</div>
                  <div className="sim-cat-meters">
                    {simCategories.map((cat) => (
                      <div key={cat.name} className="sim-meter-row">
                        <div className="sim-meter-label">
                          <span>{cat.name}</span>
                          <span className="sim-meter-val">
                            ₹{cat.total.toFixed(2)} ({cat.percentage}%)
                          </span>
                        </div>
                        <div className="sim-progress-track">
                          <div
                            className="sim-progress-bar"
                            style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulated Ledger Stream */}
              <div className="sim-ledger-panel">
                <div className="sim-ledger-header">
                  <div>
                    <span className="sim-ledger-title">Current Ledger</span>
                    <span className="sim-ledger-sub">{simTransactions.length} records active</span>
                  </div>
                  <div className="sim-total-capsule">
                    <span className="sim-total-label">Simulated Outflow</span>
                    <span className="sim-total-num">₹{simTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="sim-items-list">
                  {simTransactions.map((item) => (
                    <div key={item.id} className="sim-item-card">
                      <div className="sim-item-info">
                        <span className="sim-item-bullet"></span>
                        <div>
                          <div className="sim-item-title">{item.title}</div>
                          <span className="sim-item-category-tag">{item.category}</span>
                        </div>
                      </div>
                      <div className="sim-item-actions">
                        <span className="sim-item-price">-₹{item.amount.toFixed(2)}</span>
                        <button
                          type="button"
                          className="btn-sim-delete"
                          onClick={() => handleRemoveSimItem(item.id)}
                          title="Delete entry"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sim-cta-footer">
                  <span>Want to persist your real expenses?</span>
                  <Link to="/register" className="sim-upgrade-link">
                    Create free account →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: BENTO ARCHITECTURE */}
      <section id="features" className="landing-section">
        <div className="landing-container">
          <div className="section-header-block">
            <div className="section-eyebrow">SYSTEM ARCHITECTURE</div>
            <h2 className="section-main-title">Uncompromising utility in every detail.</h2>
            <p className="section-subtitle">
              Built on web standards with zero bloated dependencies. Instant response times and persistent local state.
            </p>
          </div>

          <div className="gapless-bento-grid">
            {/* Bento Card 1 */}
            <div className="bento-col-7">
              <div className="bento-card-content">
                <div className="bento-badge">Real-Time Telemetry</div>
                <h3 className="bento-title">Automatic Outflow Reconciliation</h3>
                <p className="bento-desc">
                  Every logged transaction recalculates monthly net burn and category proportions on the fly without page refreshes.
                </p>
                <div className="telemetry-bar-chart">
                  <div className="t-bar" style={{ height: "45%" }}><span>Mon</span></div>
                  <div className="t-bar" style={{ height: "70%" }}><span>Tue</span></div>
                  <div className="t-bar" style={{ height: "35%" }}><span>Wed</span></div>
                  <div className="t-bar active" style={{ height: "85%" }}><span>Thu</span></div>
                  <div className="t-bar" style={{ height: "60%" }}><span>Fri</span></div>
                  <div className="t-bar" style={{ height: "40%" }}><span>Sat</span></div>
                  <div className="t-bar" style={{ height: "25%" }}><span>Sun</span></div>
                </div>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="bento-col-5">
              <div className="bento-card-content">
                <div className="bento-badge">Instant Query</div>
                <h3 className="bento-title">Sub-Millisecond Search</h3>
                <p className="bento-desc">
                  Find any historical payment, receipt note, or category instantly via client-side indexing.
                </p>
                <div className="bento-search-pill-preview">
                  <div className="preview-search-input">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <span>Filter: &quot;Groceries&quot;</span>
                  </div>
                  <span className="preview-search-matches">3 matches</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3 */}
            <div className="bento-col-5">
              <div className="bento-card-content">
                <div className="bento-badge">Keyboard Ergonomics</div>
                <h3 className="bento-title">Zero Friction Interaction</h3>
                <p className="bento-desc">
                  Designed for keyboard navigation. Esc to dismiss dialogs, inline confirmations, and tactile focus states.
                </p>
                <div className="bento-details-pills">
                  <span className="micro-chip">ESC to close</span>
                  <span className="micro-chip">Enter to save</span>
                  <span className="micro-chip">Safe delete guard</span>
                </div>
              </div>
            </div>

            {/* Bento Card 4 */}
            <div className="bento-col-7">
              <div className="bento-card-content">
                <div className="bento-badge">Sovereign Data</div>
                <h3 className="bento-title">Cryptographic Session Vault</h3>
                <p className="bento-desc">
                  Your transactions belong exclusively to you. Protected with industry-standard JWT authorization and strict user partitioning.
                </p>
                <div className="bento-sync-flow">
                  <span className="sync-node">Mobile Web</span>
                  <span className="sync-arrow">⟶</span>
                  <span className="sync-node center-node">Encrypted API</span>
                  <span className="sync-arrow">⟶</span>
                  <span className="sync-node">Desktop Workspace</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PHILOSOPHY */}
      <section id="philosophy" className="landing-section">
        <div className="landing-container">
          <div className="section-header-block">
            <div className="section-eyebrow">ENGINEERING PHILOSOPHY</div>
            <h2 className="section-main-title">Crafted for clarity, not complexity.</h2>
            <p className="section-subtitle">
              Most expense software is slow, cluttered with advertisements, or tries to upsell loans. We built a clean, focused instrument.
            </p>
          </div>

          <div className="philosophy-cards-grid">
            <div className="philosophy-card">
              <div className="card-number-badge">01</div>
              <h3 className="card-title">Three-Second Logging</h3>
              <p className="card-body">
                Record an expense in seconds. Clean inputs and instant feedback ensure you log in the moment without spreadsheet friction.
              </p>
            </div>

            <div className="philosophy-card">
              <div className="card-number-badge">02</div>
              <h3 className="card-title">Clear Categorization</h3>
              <p className="card-body">
                Group your expenses into meaningful buckets. See exactly how your cash divides across groceries, housing, transit, and dining.
              </p>
            </div>

            <div className="philosophy-card">
              <div className="card-number-badge">03</div>
              <h3 className="card-title">Privacy by Default</h3>
              <p className="card-body">
                No telemetry trackers, no data monetization, no third-party ad pixels. Your finances remain private and sovereign.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="cta-banner-card">
            <h2 className="cta-main-title">Take absolute control of your cash flow.</h2>
            <p className="cta-description">
              Stop wondering where your capital went each month. Join builders and professionals tracking their finances with quiet precision.
            </p>
            <div className="cta-actions-cluster">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary-pill">
                  <span>Enter Khaata Dashboard</span>
                  <span className="btn-icon-circle">→</span>
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary-pill">
                    <span>Create Free Account</span>
                    <span className="btn-icon-circle">→</span>
                  </Link>
                  <Link to="/login" className="btn-secondary-pill">
                    <span>Sign In</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
