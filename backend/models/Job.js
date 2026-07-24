const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    salary: {
      type: String,
      default: "Competitive",
    },
    tag1: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Remote", "Hybrid", "Contract", "Internship", "Freelance"],
      default: "Full-Time",
    },
    tag2: {
      type: String,
      enum: ["Fresher", "Junior Level", "Mid Level", "Senior Level", "Lead"],
      default: "Mid Level",
    },
    posted: {
      type: String,
      default: "Just now",
    },
    // Reference to the recruiter who posted this job
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
