import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Edit3,
  Save,
  X,
  Bookmark,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import jobs from "../data/jobs";
import "./Dashboard.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name, email) => {
  if (name)
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  return email?.[0]?.toUpperCase() ?? "U";
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ─── Saved Jobs Tab ────────────────────────────────────────────────────────────
const SavedJobsTab = () => {
  const navigate = useNavigate();
  const savedIds = JSON.parse(localStorage.getItem("jp_savedJobs") || "[]");
  const savedJobs = jobs.filter((j) => savedIds.includes(j.id));

  if (savedJobs.length === 0) {
    return (
      <div>
        <p className="section-title"><Bookmark size={18} /> Saved Jobs</p>
        <div className="empty-state">
          <div className="empty-state-icon">🔖</div>
          <h3>No Saved Jobs</h3>
          <p>Bookmark jobs from the feed to revisit them here.</p>
          <button className="empty-state-btn" onClick={() => navigate("/home")}>Browse Jobs</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="section-title"><Bookmark size={18} /> Saved Jobs ({savedJobs.length})</p>
      <div className="applied-jobs-grid">
        {savedJobs.map((job) => (
          <div className="applied-job-card" key={job.id} style={{ borderLeftColor: "#6366f1" }}>
            <div className="applied-job-logo">
              <img src={job.companyLogo} alt={job.companyName} style={{ width:36, height:36, objectFit:"contain" }} />
            </div>
            <div className="applied-job-info">
              <div className="applied-job-title">{job.jobTitle}</div>
              <div className="applied-job-company">{job.companyName}</div>
              <div className="applied-job-meta">
                {job.tag1 && <span className="meta-tag">{job.tag1}</span>}
                {job.tag2 && <span className="meta-tag">{job.tag2}</span>}
                <span className="meta-tag location"><MapPin size={10} style={{ display:"inline" }} /> {job.location}</span>
              </div>
            </div>
            <div className="applied-job-right">
              <button
                onClick={() => navigate(`/apply/${job.id}`, { state: job })}
                style={{ padding:"0.4rem 1rem", background:"#17243b", color:"#fff", border:"none", borderRadius:"8px", fontWeight:700, fontSize:"0.8rem", cursor:"pointer" }}
              >
                Apply Now
              </button>
              <span className="applied-job-date">{job.salary}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AppliedJobsTab = () => {
  const navigate = useNavigate();

  // Read applications from localStorage
  const applications = JSON.parse(
    localStorage.getItem("jp_applications") || "[]"
  );

  if (applications.length === 0) {
    return (
      <div>
        <p className="section-title">
          <Briefcase size={18} /> Applied Jobs
        </p>
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No Applications Yet</h3>
          <p>
            You haven't applied to any jobs yet. Browse available positions and
            start applying!
          </p>
          <button
            className="empty-state-btn"
            onClick={() => navigate("/home")}
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="section-title">
        <Briefcase size={18} /> Applied Jobs ({applications.length})
      </p>
      <div className="applied-jobs-grid">
        {applications
          .slice()
          .reverse()
          .map((app, idx) => (
            <div className="applied-job-card" key={idx}>
              {/* Company Logo */}
              <div className="applied-job-logo">
                {app.companyLogo ? (
                  <img src={app.companyLogo} alt={app.companyName} />
                ) : (
                  <Briefcase size={22} color="#94a3b8" />
                )}
              </div>

              {/* Info */}
              <div className="applied-job-info">
                <div className="applied-job-title">
                  {app.jobTitle || "N/A"}
                </div>
                <div className="applied-job-company">{app.companyName}</div>
                <div className="applied-job-meta">
                  {app.tag1 && <span className="meta-tag">{app.tag1}</span>}
                  {app.tag2 && <span className="meta-tag">{app.tag2}</span>}
                  {app.location && (
                    <span className="meta-tag location">
                      <MapPin
                        size={10}
                        style={{ display: "inline", marginRight: "2px" }}
                      />
                      {app.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="applied-job-right">
                <span className="applied-status status-applied">
                  ✓ Applied
                </span>
                <span className="applied-job-date">
                  {formatDate(app.appliedAt)}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// ─── Profile Tab ───────────────────────────────────────────────────────────────
const ProfileTab = () => {
  const { currentUser, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    fullname: currentUser?.fullname || "",
    username: currentUser?.username || "",
    phone: currentUser?.phone || "",
    role: currentUser?.role || "Job Seeker",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    const result = updateProfile(form);
    if (result.success) {
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div>
      <p className="section-title">
        <User size={18} /> Profile Information
      </p>
      <div className="profile-grid">
        {/* Personal Info */}
        <div className="profile-card">
          <div className="profile-card-title">
            <User size={16} /> Personal Details
          </div>

          <div className="profile-field">
            <label>Full Name</label>
            <input
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Your full name"
            />
          </div>

          <div className="profile-field">
            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Your username"
            />
          </div>

          <div className="profile-field">
            <label>Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={!editing}
            >
              <option value="Job Seeker">Job Seeker</option>
              <option value="Recruiter">Recruiter</option>
            </select>
          </div>
        </div>

        {/* Contact Info */}
        <div className="profile-card">
          <div className="profile-card-title">
            <Phone size={16} /> Contact Info
          </div>

          <div className="profile-field">
            <label>
              <Mail size={12} style={{ display: "inline", marginRight: 4 }} />
              Email Address
            </label>
            <input
              value={currentUser?.email || ""}
              disabled
              title="Email cannot be changed"
            />
          </div>

          <div className="profile-field">
            <label>
              <Phone
                size={12}
                style={{ display: "inline", marginRight: 4 }}
              />
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!editing}
              placeholder="9876543210"
            />
          </div>

          <div className="profile-field">
            <label>Member Since</label>
            <input
              value={
                currentUser?.joinedAt
                  ? formatDate(currentUser.joinedAt)
                  : "—"
              }
              disabled
            />
          </div>
        </div>

        {/* Actions */}
        <div className="profile-card full-width">
          <div className="profile-actions">
            {!editing ? (
              <button className="btn-edit" onClick={() => setEditing(true)}>
                <Edit3 size={15} style={{ display: "inline", marginRight: 6 }} />
                Edit Profile
              </button>
            ) : (
              <>
                <button className="btn-save" onClick={handleSave}>
                  <Save
                    size={15}
                    style={{ display: "inline", marginRight: 6 }}
                  />
                  Save Changes
                </button>
                <button
                  className="btn-cancel-edit"
                  onClick={() => setEditing(false)}
                >
                  <X size={15} style={{ display: "inline", marginRight: 6 }} />
                  Cancel
                </button>
              </>
            )}
            {saved && (
              <span className="save-success">
                <CheckCircle size={15} /> Profile saved successfully!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applied");

  const applications = JSON.parse(localStorage.getItem("jp_applications") || "[]");
  const savedIds = JSON.parse(localStorage.getItem("jp_savedJobs") || "[]");

  const initials = getInitials(currentUser?.fullname, currentUser?.email);

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-body">
        {/* Hero Banner */}
        <div className="dashboard-hero">
          <div className="hero-avatar">{initials}</div>

          <div className="hero-info">
            <h2>
              {currentUser?.fullname
                ? `Welcome, ${currentUser.fullname.split(" ")[0]}! 👋`
                : "Welcome back!"}
            </h2>
            <p>{currentUser?.email}</p>
            <span className="hero-role-badge">
              {currentUser?.role || "Job Seeker"}
            </span>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">{applications.length}</div>
              <div className="hero-stat-label">Applied</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">0</div>
              <div className="hero-stat-label">Interviews</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">0</div>
              <div className="hero-stat-label">Saved</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === "applied" ? "active" : ""}`}
            onClick={() => setActiveTab("applied")}
          >
            <Briefcase size={15} />
            Applied Jobs
            {applications.length > 0 && (
              <span style={{ background:"#c7862e", color:"#fff", borderRadius:"999px", fontSize:"0.7rem", padding:"1px 7px", fontWeight:700 }}>
                {applications.length}
              </span>
            )}
          </button>

          <button
            className={`tab-btn ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            <Bookmark size={15} />
            Saved Jobs
            {savedIds.length > 0 && (
              <span style={{ background:"#6366f1", color:"#fff", borderRadius:"999px", fontSize:"0.7rem", padding:"1px 7px", fontWeight:700 }}>
                {savedIds.length}
              </span>
            )}
          </button>

          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={15} />
            My Profile
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "applied" && <AppliedJobsTab />}
        {activeTab === "saved" && <SavedJobsTab />}
        {activeTab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
};

export default Dashboard;
