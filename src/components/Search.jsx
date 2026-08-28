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
    <div className="w-full flex justify-center mt-10 px-6 box-border">
      <div className="w-full max-w-7xl bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-5 flex items-center gap-4 flex-wrap">
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
          className="flex-[1_1_200px] h-[52px] px-5 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-[0.95rem] outline-none min-w-0 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />

        {/* Job Type */}
        <select className="w-[180px] h-[52px] px-4 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none">
          {jobTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        {/* Experience */}
        <select className="w-[180px] h-[52px] px-4 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none">
          {experienceLevels.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="h-[52px] px-8 bg-gradient-to-br from-indigo-500 to-violet-500 hover:opacity-90 text-white rounded-xl font-bold text-[0.95rem] cursor-pointer transition-opacity border-none"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;