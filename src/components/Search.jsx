import React, { useState } from "react";

const Search = ({ onSearch }) => {
  const [search, setSearch] = useState("");

  const jobTypes = [
    "All Jobs",
    "Full Time",
    "Part Time",
    "Remote",
    "Hybrid",
    "Internship",
    "Contract",
    "Freelance",
  ];

  const experienceLevels = [
    "All Levels",
    "Fresher",
    "Junior",
    "Mid Level",
    "Senior",
    "Lead",
  ];

  const handleSearch = () => {
    onSearch(search);
  };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "2.5rem", padding: "0 1.5rem", boxSizing: "border-box" }}>
      <div style={{
        width: "100%",
        maxWidth: "1280px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        padding: "1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
      }}>
        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search jobs, companies..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            onSearch(value);
          }}
          style={{
            flex: "1 1 200px",
            height: "52px",
            padding: "0 1.25rem",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            color: "#111",
            fontSize: "0.95rem",
            outline: "none",
            minWidth: "0",
          }}
        />

        {/* Job Type */}
        <select style={{
          width: "180px",
          height: "52px",
          padding: "0 1rem",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          color: "#111",
          fontSize: "0.9rem",
          background: "#fff",
        }}>
          {jobTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        {/* Experience */}
        <select style={{
          width: "180px",
          height: "52px",
          padding: "0 1rem",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          color: "#111",
          fontSize: "0.9rem",
          background: "#fff",
        }}>
          {experienceLevels.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          style={{
            height: "52px",
            padding: "0 2rem",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;