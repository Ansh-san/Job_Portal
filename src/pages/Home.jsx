import React, { useState } from "react";
import Search from "../components/search";
import Card2 from "../components/card2";
import jobs from "../data/jobs";

const Home = () => {
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  // Search Function
  const handleSearch = (text) => {
    const value = text.toLowerCase();
    const result = jobs.filter((job) => {
      return (
        job.companyName.toLowerCase().includes(value) ||
        job.jobTitle.toLowerCase().includes(value) ||
        job.location.toLowerCase().includes(value)
      );
    });
    setFilteredJobs(result);
  };
  return (
    <div>
      <Search onSearch={handleSearch} />
      <div className="parent">
        {filteredJobs.map((elem) => {
          return (
            <Card2
              key={elem.id}
              id={elem.id}
              companyLogo={elem.companyLogo}
              companyName={elem.companyName}
              posted={elem.posted}
              jobTitle={elem.jobTitle}
              tag1={elem.tag1}
              tag2={elem.tag2}
              salary={elem.salary}
              location={elem.location}
            />
          );
        })}{" "}
      </div>
    </div>
  );
};
export default Home;