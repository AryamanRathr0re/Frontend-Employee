import { useEffect, useState } from "react";
import {
  getCandidates,
  updateCandidateStatus,
} from "../services/candidateService";
import CandidateCard from "../components/CandidateCard.jsx";

const STATUSES = ["applied", "interview", "hired", "rejected"];

export default function Dashboard({ reloadSignal = 0 }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadCandidates = async () => {
    try {
      const data = await getCandidates();
      setCandidates(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadCandidates();
  }, [reloadSignal]);

  const handleStatusSubmit = async (id, newStatus) => {
    try {
      const updated = await updateCandidateStatus(id, newStatus);
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: updated.status ?? newStatus } : c,
        ),
      );
      return true;
    } catch {
      return false;
    }
  };

  const statusLabel = (s) => {
    const key = String(s || "").toLowerCase();
    const map = {
      applied: "pending",
      interview: "reviewed",
      hired: "hired",
      rejected: "rejected",
      pending: "pending",
      reviewed: "reviewed",
    };
    return map[key] || key;
  };

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      !searchTerm ||
      (c.jobTitle &&
        c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.status &&
        (c.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          statusLabel(c.status).includes(searchTerm.toLowerCase())));
    const matchesStatus =
      !statusFilter || statusLabel(c.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const total = candidates.length;
  const pendingCount = candidates.filter(
    (c) => statusLabel(c.status) === "pending",
  ).length;
  const reviewedCount = candidates.filter(
    (c) => statusLabel(c.status) === "reviewed",
  ).length;
  const hiredCount = candidates.filter(
    (c) => statusLabel(c.status) === "Hired",
  ).length;

  return (
    <div className="app-container">
      <h1 className="page-title">Dashboard</h1>

      <div className="metrics">
        <div className="metric-card">
          <div className="metric-title">Total candidates</div>
          <div className="metric-value">{total}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Pending</div>
          <div className="metric-value">{pendingCount}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Reviewed</div>
          <div className="metric-value">{reviewedCount}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Hired</div>
          <div className="metric-value">{hiredCount}</div>
        </div>
      </div>

      <div className="filters">
        <input
          className="input"
          placeholder="Search by job title or status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="cards">
          {filtered.length === 0 ? (
            <div className="muted">No candidates found</div>
          ) : (
            filtered.map((c) => (
              <CandidateCard
                key={c.id ?? `${c.name}-${c.jobTitle}`}
                candidate={c}
                onSubmitStatus={handleStatusSubmit}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
