import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./ApplyForm.css";

const ApplyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const location = useLocation();
  const job = location.state;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    experience: "",
    skills: "",
    coverLetter: "",
    resume: null,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "resume") {
      setFormData({
        ...formData,
        resume: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain exactly 10 digits";
    }

    if (!formData.college.trim()) {
      newErrors.college = "College is required";
    }

    if (!formData.experience) {
      newErrors.experience = "Select your experience";
    }

    if (!formData.skills.trim()) {
      newErrors.skills = "Skills are required";
    }

    if (!formData.resume) {
      newErrors.resume = "Please upload your resume";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);

    console.log({
      jobId: id,
      company: job.companyName,
      ...formData,
    });

    setTimeout(() => {
      navigate("/");
    }, 2500);
  };

  return (
    <div className="application-page">
      <div className="application-card">
        {/* Header */}
        <div className="header">
          <div className="company-logo">
            <img src={job.companyLogo} alt={job.companyName} />
          </div>

          <h1>{job.companyName}</h1>

          <p className="subtitle">
            Join our growing team and build amazing products.
          </p>

          <h2>{job.jobTitle}</h2>

          <p>{job.location}</p>
        </div>

        {/* Job Details */}

        <div className="job-details">
          <div className="detail">
            <h4>Salary</h4>
            <p>{job.salary}</p>
          </div>

          <div className="detail">
            <h4>Location</h4>
            <p>{job.location}</p>
          </div>

          <div className="detail">
            <h4>Employment</h4>
            <p>{job.tag1}</p>
          </div>

          <div className="detail">
            <h4>Experience</h4>
            <p>{job.tag2}</p>
          </div>
        </div>

        {/* Success */}

        {submitted && (
          <div className="success-box">
            🎉 Your application has been submitted successfully.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />

              <small>{errors.fullName}</small>
            </div>

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
              />

              <small>{errors.email}</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />

              <small>{errors.phone}</small>
            </div>

            <div className="form-group">
              <label>College / University</label>

              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter your college"
              />

              <small>{errors.college}</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Experience</label>

              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Fresher</option>
                <option>0-1 Years</option>
                <option>1-3 Years</option>
                <option>3-5 Years</option>
                <option>5+ Years</option>
              </select>

              <small>{errors.experience}</small>
            </div>

            <div className="form-group">
              <label>Skills</label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, HTML, CSS"
              />

              <small>{errors.skills}</small>
            </div>
          </div>

          <div className="form-group">
            <label>Upload Resume</label>

            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
            />

            <small>{errors.resume}</small>
          </div>

          <div className="form-group">
            <label>Cover Letter</label>

            <textarea
              rows="6"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Tell us why you'd be a great fit for this role..."
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>

            <button type="submit" className="submit-btn">
              Apply Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;