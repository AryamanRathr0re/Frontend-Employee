import api from "./api";

const normalizeStatusForBackend = (s) => {
  const key = String(s || "").toLowerCase();
  const map = {
    pending: "Pending",
    applied: "Pending",
    reviewed: "Reviewed",
    interview: "Interview",
    hired: "Hired",
    rejected: "Rejected",
  };
  return map[key] || s;
};

export async function getCandidates() {
  const res = await api.get("/candidates");
  const d = res.data;
  if (Array.isArray(d)) return d;
  if (d && Array.isArray(d.data)) return d.data;
  if (d && Array.isArray(d.candidates)) return d.candidates;
  if (d && Array.isArray(d.result)) return d.result;
  return [];
}

export async function addCandidate(payload) {
  const res = await api.post("/candidates", payload);
  return res.data;
}

export async function updateCandidateStatus(id, status) {
  const val = normalizeStatusForBackend(status);
  const body = { status: val };
  try {
    const res = await api.patch(`/candidates/${id}/status`, body);
    return res.data;
  } catch {
    const res = await api.put(`/candidates/${id}/status`, body);
    return res.data;
  }
}

export async function deleteCandidate(id) {
  const res = await api.delete(`/candidates/${id}`);
  return res.data;
}
