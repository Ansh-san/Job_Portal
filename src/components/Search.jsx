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
    <div className="w-full flex justify-center mt-10 px-6">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4">

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
          className="flex-grow h-14 px-5 rounded-lg border border-gray-300 text-black outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Job Type */}
        <select className="w-48 h-14 px-4 rounded-lg border border-gray-300 text-black">
          {jobTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        {/* Experience */}
        <select className="w-48 h-14 px-4 rounded-lg border border-gray-300 text-black">
          {experienceLevels.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
        >
          Search
        </button>

      </div>
    </div>
  );
};

export default Search;