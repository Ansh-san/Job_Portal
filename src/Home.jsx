import React from "react";
import "./Home.css";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Google",
    location: "Bangalore",
    salary: "₹12 LPA",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "Microsoft",
    location: "Hyderabad",
    salary: "₹15 LPA",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Amazon",
    location: "Delhi",
    salary: "₹10 LPA",
  },
];

export default function Home() {
  return (
    <div className="home">
      <div className="bg-circle one"></div>
      <div className="bg-circle two"></div>

      <section className="hero">
        <h1>Find Your Dream Job 🚀</h1>
        <p>Discover top opportunities from leading companies.</p>

        <div className="search-box">
          <input type="text" placeholder="Search jobs..." />
          <button>Search</button>
        </div>
      </section>

      <section className="jobs-section">
        {jobs.map((job) => (
          <div className="job-card" key={job.id}>
            <div className="badge">Remote</div>

            <h2>{job.title}</h2>

            <div className="details">
              <span>🏢 {job.company}</span>
              <span>📍 {job.location}</span>
              <span>💰 {job.salary}</span>
            </div>

            <button className="apply-btn">Apply Now</button>
          </div>
        ))}
      </section>
    </div>
  );
}