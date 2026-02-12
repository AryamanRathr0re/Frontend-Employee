import { useState } from "react";
import api from "../services/api";

export default function ReferralForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Required";
    if (!jobTitle.trim()) e.jobTitle = "Required";
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      e.email = "Invalid email";
    if (!phone.trim() || !/^[0-9+\-\s()]{7,}$/.test(phone))
      e.phone = "Invalid phone";
    if (!resume) e.resume = "PDF required";
    else if (
      !(resume.type === "application/pdf" || /\.pdf$/i.test(resume.name))
    )
      e.resume = "Only PDF allowed";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("email", email.trim());
      fd.append("phone", phone.trim());
      fd.append("jobTitle", jobTitle.trim());
      fd.append("status", "Pending");
      fd.append("resume", resume);
      await api.post("/candidates", fd);
      setName("");
      setEmail("");
      setPhone("");
      setJobTitle("");
      setResume(null);
      setErrors({});
      setSuccess("Referral submitted successfully");
      if (onSuccess) onSuccess();
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Submission failed";
      setErrors((prev) => ({ ...prev, form: msg }));
      setSuccess("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2 className="page-title" style={{ fontSize: 20 }}>
        Referral Form
      </h2>
      <div className="card-controls">
        <label className="label">Candidate Name</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>
      <div className="card-controls">
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>
      <div className="card-controls">
        <label className="label">Phone Number</label>
        <input
          className="input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {errors.phone && <div className="error">{errors.phone}</div>}
      </div>
      <div className="card-controls">
        <label className="label">Job Title</label>
        <input
          className="input"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        {errors.jobTitle && <div className="error">{errors.jobTitle}</div>}
      </div>
      <div className="card-controls">
        <label className="label">Resume (PDF)</label>
        <input
          className="input"
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
        />
        {errors.resume && <div className="error">{errors.resume}</div>}
      </div>
      <div className="card-controls">
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Referral"}
        </button>
        {errors.form && (
          <div className="alert alert-error" style={{ marginTop: 8 }}>
            {errors.form}
          </div>
        )}
        {success && (
          <div className="alert alert-success" style={{ marginTop: 8 }}>
            {success}
          </div>
        )}
      </div>
    </form>
  );
}
