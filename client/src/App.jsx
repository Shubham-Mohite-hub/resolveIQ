import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
  () => Boolean(localStorage.getItem("token"))
);

 
const [tickets, setTickets] = useState([]);
const [ticket, setTicket] = useState(null);
const [ticketLoading, setTicketLoading] = useState(true);
const [ticketError, setTicketError] = useState("");
const totalTickets = tickets.length;

const urgentTickets = tickets.filter(
  (item) => item.priority?.toLowerCase() === "urgent"
).length;

const openTickets = tickets.filter(
  (item) => item.status?.toLowerCase() === "open"
).length;

useEffect(() => {
  if (!isLoggedIn) {
    return;
  }

  async function fetchTickets() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in first.");
      }

      const response = await fetch(
        "http://localhost:5000/api/tickets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch tickets."
        );
      }

      if (!data.tickets || data.tickets.length === 0) {
  setTickets([]);
  setTicket(null);
  return;
}

setTickets(data.tickets);

const firstTicket = data.tickets[0];

setTicket({
  id: firstTicket._id,
  customer: firstTicket.customerName,
  email: firstTicket.customerEmail,
  subject: firstTicket.subject,
  description: firstTicket.description,
  priority: firstTicket.priority,
  category: firstTicket.category,
  status: firstTicket.status,
});
    } catch (err) {
      setTicketError(err.message || "Could not fetch tickets.");
    } finally {
      setTicketLoading(false);
    }
  }

    fetchTickets();
}, [isLoggedIn]);


async function analyzeTicket() {
  setLoading(true);
  setError("");
  setAnalysis(null);

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please log in first to analyze this ticket.");
    }

    const response = await fetch(
      `http://localhost:5000/api/ai/analyze/${ticket.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Analysis failed."
      );
    }

    setAnalysis(data.analysis);
  } catch (err) {
    setError(err.message || "Could not connect to the server.");
  } finally {
    setLoading(false);
  }
}



  if (!isLoggedIn) {
  return <Login onLogin={() => setIsLoggedIn(true)} />;
}

if (ticketLoading) {
  return <div className="loading-message">Loading tickets...</div>;
}

if (ticketError) {
  return <div className="loading-message">{ticketError}</div>;
}

if (!ticket) {
  return <div className="loading-message">No ticket available.</div>;
}

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">R</div>
          <div>
            <h2>ResolveIQ</h2>
            <p>Support Intelligence</p>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <div className="nav-item active">▦ <span>Dashboard</span></div>
        <div className="nav-item">▤ <span>All Tickets</span></div>
        <div className="nav-item">◉ <span>AI Insights</span></div>

        <div className="sidebar-footer">
          <div className="avatar">SA</div>
          <div>
            <strong>Support Agent</strong>
            <p>Agent workspace</p>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">WORKSPACE / OVERVIEW</p>
            <h1>Support Dashboard</h1>
          </div>
          <div className="connection-status">
            <span className="status-dot" /> AI service ready
          </div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow light">AI-POWERED CUSTOMER SUPPORT</p>
            <h2>Understand issues faster.</h2>
            <p>
              Analyze customer conversations and uncover the information
              your support team needs.
            </p>
          </div>
          <div className="welcome-symbol">✳</div>
        </section>

        
<section className="stats-grid">
  <div className="stat-card">
    <p>Total Tickets</p>
    <h3>{totalTickets}</h3>
    <span>Tickets fetched from MongoDB</span>
  </div>

  <div className="stat-card">
    <p>Urgent Tickets</p>
    <h3 className="urgent-text">{urgentTickets}</h3>
    <span>Require prompt attention</span>
  </div>

  <div className="stat-card">
    <p>Open Tickets</p>
    <h3>{openTickets}</h3>
    <span>Awaiting resolution</span>
  </div>
</section>


        
<section className="ticket-list">
  <h2>Your Tickets ({tickets.length})</h2>

  {tickets.map((item) => (
    <button
      key={item._id}
      className={`ticket-list-item ${
        ticket.id === item._id ? "selected" : ""
      }`}
     onClick={() => {


  setTicket({
    id: item._id,
    customer: item.customerName,
    email: item.customerEmail,
    subject: item.subject,
    description: item.description,
    priority: item.priority,
    category: item.category,
    status: item.status,
  });

  setAnalysis(null);
  setError("");
}}
    >
      <strong>{item.subject}</strong>
      <span>
        {item.customerName} · {item.status}
      </span>
    </button>
  ))}
</section>


        <section className="ticket-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CUSTOMER CASE</p>
              <h2>{ticket.subject}</h2>
            </div>
            <span className="priority-badge">
  {ticket.priority.toUpperCase()}
</span>
          </div>

          <div className="customer-row">
            <div className="customer-avatar">AS</div>
            <div>
              <strong>{ticket.customer}</strong>
              <p>{ticket.email}</p>
            </div>
            <span className="status-badge">{ticket.status}</span>
          </div>

          <div className="issue-box">
            <p className="eyebrow">CUSTOMER MESSAGE</p>
            <p>{ticket.description}</p>
          </div>

          <div className="analysis-action">
            <div>
              <h3>AI Ticket Analysis</h3>
              <p>Generate a summary and extract actionable insights.</p>
            </div>
            <button onClick={analyzeTicket} disabled={loading}>
              {loading ? "Analyzing..." : "✳ Analyze with AI"}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {analysis && (
            <div className="analysis-results">
              <div className="results-heading">
                <div>
                  <p className="eyebrow">GENERATED INSIGHTS</p>
                  <h3>Analysis complete</h3>
                </div>
                <span className="success-badge">AI analyzed</span>
              </div>

              <div className="result-block">
                <label>Summary</label>
                <p>{analysis.summary}</p>
              </div>

              <div className="result-grid">
                <div className="result-block">
                  <label>Intent</label>
                  <p>{analysis.intent}</p>
                </div>
                <div className="result-block">
                  <label>Sentiment</label>
                  <p>{analysis.sentiment}</p>
                </div>
                <div className="result-block">
                  <label>Category</label>
                  <p>{analysis.category}</p>
                </div>
                <div className="result-block">
                  <label>Priority</label>
                  <p>{analysis.priority}</p>
                </div>
              </div>

              <div className="result-block">
                <label>Key information</label>
                <ul>
                  {analysis.keyInformation?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        <footer className="page-footer">
          ResolveIQ · AI-assisted support, with humans in control.
        </footer>
      </main>
    </div>
  );
}

export default App;