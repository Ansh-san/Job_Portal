import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, MapPin, Briefcase, SlidersHorizontal,
  X, BadgeCheck, Bookmark, BookmarkCheck,
  ArrowUpDown, Zap, TrendingUp, Star,
} from "lucide-react";
import Navbar from "../components/Navbar";
import jobs from "../data/jobs";
import "./JobHome.css";

// ─── Deterministic "match score" from job id (85–99%) ─────────────────────────
const getMatchScore = (id) => 85 + (id * 7) % 15;

// ─── Deterministic applicant count ────────────────────────────────────────────
const getApplicants = (id) => [42, 118, 76, 203, 55, 89, 134, 61, 97, 148][id % 10];

// ─── Is the job "new" (posted within 3 days) or "hot" ────────────────────────
const isNew  = (posted) => posted.includes("1") || posted.includes("2 days");
const isHot  = (posted) => parseInt(posted) >= 7;
const isQuick = (id) => id % 3 === 0;

// ─── Badge component ───────────────────────────────────────────────────────────
const JobBadge = ({ posted, id }) => {
  if (isNew(posted))  return <span className="badge-new">🆕 New</span>;
  if (isHot(posted))  return <span className="badge-hot">🔥 Hot</span>;
  return null;
};

// ─── Job Type options ──────────────────────────────────────────────────────────
const JOB_TYPES = ["Full-Time", "Part-Time", "Remote", "Hybrid", "Contract", "Internship"];
const EXP_LEVELS = ["Fresher", "Junior Level", "Mid Level", "Senior Level", "Lead"];
const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "newest",    label: "Newest First" },
  { value: "salary",    label: "Highest Salary" },
];

const TRENDING = ["React Developer", "Frontend Engineer", "UI/UX Designer", "Remote", "Senior Level"];

// ─── Saved Jobs helpers ───────────────────────────────────────────────────────
const getSaved = () => JSON.parse(localStorage.getItem("jp_savedJobs") || "[]");
const toggleSave = (jobId) => {
  const saved = getSaved();
  const next = saved.includes(jobId)
    ? saved.filter((id) => id !== jobId)
    : [...saved, jobId];
  localStorage.setItem("jp_savedJobs", JSON.stringify(next));
  return next;
};

// ─── Single Job Card ───────────────────────────────────────────────────────────
const JobCard = ({ job, savedIds, onToggleSave }) => {
  const navigate = useNavigate();
  const saved    = savedIds.includes(job.id);
  const score    = getMatchScore(job.id);
  const pct      = `${Math.round(score / 100 * 360)}deg`;

  return (
    <div className="job-card-v2">
      {/* Company Logo */}
      <div className="card-logo">
        <img src={job.companyLogo} alt={job.companyName} />
      </div>

      {/* Body */}
      <div className="card-body">
        {/* Top row: badges + save */}
        <div className="card-top-row">
          <div className="card-badges">
            <JobBadge posted={job.posted} id={job.id} />
            {isQuick(job.id) && <span className="badge-quick">⚡ Quick Apply</span>}
          </div>
          <button
            className={`save-job-btn ${saved ? "saved" : ""}`}
            title={saved ? "Unsave job" : "Save job"}
            onClick={() => onToggleSave(job.id)}
          >
            {saved ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
          </button>
        </div>

        {/* Company name */}
        <div className="card-company">
          {job.companyName}
          {["Google", "Amazon", "Microsoft", "Apple", "Meta"].includes(job.companyName) && (
            <BadgeCheck size={13} className="verified-icon" />
          )}
          <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#94a3b8" }}>
            {job.posted}
          </span>
        </div>

        {/* Job Title */}
        <h2 className="card-title">{job.jobTitle}</h2>

        {/* Meta: location, salary */}
        <div className="card-meta">
          <span className="card-meta-item">
            <MapPin size={13} /> {job.location}
          </span>
          <span className="card-meta-item">
            <Briefcase size={13} /> {job.tag1}
          </span>
        </div>

        {/* Tags */}
        <div className="card-tags">
          <span className="tag tag-type">{job.tag1}</span>
          <span className="tag tag-level">{job.tag2}</span>
        </div>

        {/* Footer */}
        <div className="card-footer">
          <div>
            <div className="card-salary">{job.salary}</div>
            <div className="card-applicants">
              <TrendingUp size={11} style={{ display:"inline" }} /> {getApplicants(job.id)} applicants
            </div>
          </div>

          <div className="card-actions">
            {isQuick(job.id) ? (
              <button
                className="btn-quick-apply"
                onClick={() => navigate(`/apply/${job.id}`, { state: job })}
              >
                <Zap size={13} style={{ display: "inline", marginRight: 4 }} />
                Quick Apply
              </button>
            ) : (
              <button
                className="btn-apply"
                onClick={() => navigate(`/apply/${job.id}`, { state: job })}
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Match Score Ring */}
      <div className="match-score-wrap">
        <div
          className="match-ring"
          style={{ "--pct": pct }}
          data-val={score}
        />
        <span className="match-label">Match</span>
      </div>
    </div>
  );
};

// ─── Main Home Page ────────────────────────────────────────────────────────────
const Home = () => {
  // Search / filter state
  const [searchText,  setSearchText]  = useState("");
  const [locationQ,   setLocationQ]   = useState("");
  const [jobTypes,    setJobTypes]    = useState([]);
  const [expLevels,   setExpLevels]   = useState([]);
  const [sortBy,      setSortBy]      = useState("relevance");

  // The "committed" filters (applied on button click)
  const [applied, setApplied] = useState({
    searchText: "", locationQ: "", jobTypes: [], expLevels: [],
  });

  // Saved jobs
  const [savedIds, setSavedIds] = useState(getSaved);

  const handleToggleSave = useCallback((jobId) => {
    setSavedIds(toggleSave(jobId));
  }, []);

  // ── Apply filters on button click ────────────────────────
  const handleSearch = () => {
    setApplied({ searchText, locationQ, jobTypes, expLevels });
  };

  const handleTrending = (term) => {
    setSearchText(term);
    setApplied((prev) => ({ ...prev, searchText: term }));
  };

  // ── Remove a single active chip ──────────────────────────
  const removeType  = (t) => {
    const next = jobTypes.filter((x) => x !== t);
    setJobTypes(next);
    setApplied((prev) => ({ ...prev, jobTypes: next }));
  };
  const removeExp   = (e) => {
    const next = expLevels.filter((x) => x !== e);
    setExpLevels(next);
    setApplied((prev) => ({ ...prev, expLevels: next }));
  };
  const clearAll = () => {
    setSearchText(""); setLocationQ(""); setJobTypes([]); setExpLevels([]);
    setApplied({ searchText: "", locationQ: "", jobTypes: [], expLevels: [] });
  };

  const totalActive = applied.jobTypes.length + applied.expLevels.length
    + (applied.searchText ? 1 : 0) + (applied.locationQ ? 1 : 0);

  // ── Filter + sort jobs ───────────────────────────────────
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (applied.searchText) {
      const q = applied.searchText.toLowerCase();
      result = result.filter((j) =>
        j.jobTitle.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q) ||
        j.tag1.toLowerCase().includes(q) ||
        j.tag2.toLowerCase().includes(q)
      );
    }

    if (applied.locationQ) {
      const q = applied.locationQ.toLowerCase();
      result = result.filter((j) => j.location.toLowerCase().includes(q));
    }

    if (applied.jobTypes.length > 0) {
      result = result.filter((j) => applied.jobTypes.includes(j.tag1));
    }

    if (applied.expLevels.length > 0) {
      result = result.filter((j) => applied.expLevels.includes(j.tag2));
    }

    if (sortBy === "salary") {
      result.sort((a, b) => parseInt(b.salary) - parseInt(a.salary));
    } else if (sortBy === "newest") {
      result.sort((a, b) => parseInt(a.posted) - parseInt(b.posted));
    }

    return result;
  }, [applied, sortBy]);

  // ── Checkbox helpers ─────────────────────────────────────
  const toggleType = (t) =>
    setJobTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const toggleExp  = (e) =>
    setExpLevels((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]);

  // Count per type in current unfiltered jobs
  const typeCounts = Object.fromEntries(
    JOB_TYPES.map((t) => [t, jobs.filter((j) => j.tag1 === t).length])
  );
  const expCounts = Object.fromEntries(
    EXP_LEVELS.map((e) => [e, jobs.filter((j) => j.tag2 === e).length])
  );

  return (
    <div className="home-page">
      <Navbar />

      {/* ── Hero Search Banner ───────────────────────────── */}
      <div className="hero-search-banner">
        <div className="hero-tagline">
          <h1>Find Your <span>Dream Job</span></h1>
          <p>Discover opportunities that match your skills and location</p>
        </div>

        {/* Main search bar */}
        <div className="search-bar-wrap">
          <div className="search-bar">
            <div className="search-field">
              <Search size={18} />
              <input
                placeholder="Job title, company, skills…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="search-field" style={{ flex: "0 0 220px" }}>
              <MapPin size={18} />
              <input
                placeholder="City, state…"
                value={locationQ}
                onChange={(e) => setLocationQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button className="search-btn" onClick={handleSearch}>
              <Search size={16} /> Search Jobs
            </button>
          </div>
        </div>

        {/* Trending searches */}
        <div className="trending-section">
          <span className="trending-label">🔍 Trending:</span>
          {TRENDING.map((t) => (
            <button key={t} className="trending-chip" onClick={() => handleTrending(t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="stats-strip">
          <div className="stat-item">
            <strong>{jobs.length}+</strong>
            <span>Live Jobs</span>
          </div>
          <div className="stat-item">
            <strong>50+</strong>
            <span>Companies</span>
          </div>
          <div className="stat-item">
            <strong>1.2K+</strong>
            <span>Applicants</span>
          </div>
        </div>
      </div>

      {/* ── Main Layout ──────────────────────────────────── */}
      <div className="home-body">
        {/* Sidebar */}
        <aside className="filter-sidebar">
          <div className="sidebar-header">
            <h3><SlidersHorizontal size={15} /> Filters {totalActive > 0 && <span style={{ background:"#c7862e", color:"#fff", borderRadius:"999px", fontSize:"0.7rem", padding:"1px 7px" }}>{totalActive}</span>}</h3>
            {totalActive > 0 && <button className="clear-btn" onClick={clearAll}>Clear All</button>}
          </div>

          {/* Job Type */}
          <div className="filter-group">
            <div className="filter-group-title">Job Type</div>
            {JOB_TYPES.map((t) => (
              <label key={t} className="filter-option">
                <input
                  type="checkbox"
                  checked={jobTypes.includes(t)}
                  onChange={() => toggleType(t)}
                />
                {t}
                <span className="count-badge">{typeCounts[t] || 0}</span>
              </label>
            ))}
          </div>

          {/* Experience Level */}
          <div className="filter-group">
            <div className="filter-group-title">Experience</div>
            {EXP_LEVELS.map((e) => (
              <label key={e} className="filter-option">
                <input
                  type="checkbox"
                  checked={expLevels.includes(e)}
                  onChange={() => toggleExp(e)}
                />
                {e}
                <span className="count-badge">{expCounts[e] || 0}</span>
              </label>
            ))}
          </div>

          {/* Location */}
          <div className="filter-group">
            <div className="filter-group-title">Location</div>
            <input
              className="sidebar-location-input"
              placeholder="e.g. Mumbai, Remote…"
              value={locationQ}
              onChange={(e) => setLocationQ(e.target.value)}
            />
          </div>

          {/* Apply button in sidebar */}
          <div className="filter-group">
            <button
              onClick={handleSearch}
              style={{
                width:"100%", padding:"0.7rem",
                background:"#17243b", color:"#fff",
                border:"none", borderRadius:"10px",
                fontWeight:700, fontSize:"0.9rem", cursor:"pointer",
              }}
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Job Feed */}
        <div className="job-feed">
          {/* Toolbar */}
          <div className="feed-toolbar">
            <div className="feed-count">
              Showing <strong>{filteredJobs.length}</strong> of <strong>{jobs.length}</strong> jobs
            </div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Active filter chips */}
          {(applied.jobTypes.length > 0 || applied.expLevels.length > 0 ||
            applied.searchText || applied.locationQ) && (
            <div className="active-chips">
              {applied.searchText && (
                <span className="chip">
                  🔍 "{applied.searchText}"
                  <button className="chip-remove" onClick={() => { setSearchText(""); setApplied((p) => ({...p, searchText:""})); }}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {applied.locationQ && (
                <span className="chip">
                  <MapPin size={11} /> {applied.locationQ}
                  <button className="chip-remove" onClick={() => { setLocationQ(""); setApplied((p) => ({...p, locationQ:""})); }}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {applied.jobTypes.map((t) => (
                <span key={t} className="chip">
                  {t}
                  <button className="chip-remove" onClick={() => removeType(t)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              {applied.expLevels.map((e) => (
                <span key={e} className="chip">
                  {e}
                  <button className="chip-remove" onClick={() => removeExp(e)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Job cards */}
          {filteredJobs.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button
                onClick={clearAll}
                style={{ marginTop:"1rem", padding:"0.6rem 1.5rem", background:"#17243b", color:"#fff", border:"none", borderRadius:"9px", cursor:"pointer", fontWeight:700 }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedIds={savedIds}
                onToggleSave={handleToggleSave}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
