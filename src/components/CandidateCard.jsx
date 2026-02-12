import { useState } from "react";

const statusLabel = (s) => {
  const key = String(s || "").toLowerCase();
  const map = {
    applied: "Pending",
    interview: "Interview",
    hired: "Hired",
    rejected: "Rejected",
    pending: "Pending",
    reviewed: "Reviewed",
  };
  return map[key] || s;
};

const statusClass = (s) => {
  const key = String(s || "").toLowerCase();
  const map = {
    applied: "badge-pending",
    pending: "badge-pending",
    reviewed: "badge-reviewed",
    interview: "badge-interview",
    hired: "badge-hired",
    rejected: "badge-rejected",
  };
  return `badge ${map[key] || ""}`;
};

export default function CandidateCard({ candidate, onSubmitStatus }) {
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="candidate-name">{candidate.name}</div>
          <div className="candidate-title">
            {candidate.jobTitle || candidate.title || candidate.role}
          </div>
        </div>
        <span className={statusClass(candidate.status)}>
          {statusLabel(candidate.status)}
        </span>
      </div>
      <div className="card-controls">
        <label className="label">Set Status</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Pending", "Reviewed", "Hired", "Rejected", "Interview"].map(
            (val) => (
              <button
                key={val}
                className="button"
                type="button"
                disabled={submitting}
                onClick={async () => {
                  setSubmitting(true);
                  setMsg("");
                  setErr("");
                  try {
                    const ok = await onSubmitStatus(
                      candidate.id ?? candidate._id,
                      val,
                    );
                    if (ok) setMsg("Status updated");
                    else setErr("Update failed");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {submitting ? "Updating..." : val}
              </button>
            ),
          )}
        </div>
        {msg && (
          <div className="alert alert-success" style={{ marginTop: 8 }}>
            {msg}
          </div>
        )}
        {err && (
          <div className="alert alert-error" style={{ marginTop: 8 }}>
            {err}
          </div>
        )}
      </div>
    </div>
  );
}
