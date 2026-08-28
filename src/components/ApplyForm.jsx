import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import applicationService from "../api/applicationService";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";

const ApplyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const location = useLocation();
  const job = location.state;

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  if (!job) {
    return <div className="p-8 text-center text-slate-400 font-medium">Job data not found. Please go back and try again.</div>;
  }

  const [formData, setFormData] = useState({
    fullName: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: "",
    college: "",
    experience: "",
    skills: "",
    coverLetter: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.experience) newErrors.experience = "Select your experience";
    if (!formData.skills.trim()) newErrors.skills = "Skills are required";
    if (!resumeFile && !userInfo?.resumeUrl) newErrors.resumeFile = "Please upload a resume";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // 1. Upload resume if a new file is provided
      if (resumeFile) {
        const uploadData = new FormData();
        uploadData.append('resume', resumeFile);
        
        // This will update the user's resumeUrl on the backend
        // We'll need to import userService for this to work
        const { default: userService } = await import('../api/userService');
        const uploadResponse = await userService.uploadResume(uploadData);
        
        // Update local storage so UI reflects the new resume immediately
        if (userInfo) {
          userInfo.resumeUrl = uploadResponse.resumeUrl;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
      }

      // 2. Submit the application
      await applicationService.applyForJob(id, formData);
      setSubmitted(true);
      toast.success("Application submitted successfully!");
      
      setTimeout(() => {
        navigate("/jobseeker/dashboard");
      }, 2000);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to apply. You may have already applied.';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 sm:p-12 text-white">
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-2 tracking-tight">{job.company}</h1>
          <p className="text-blue-100 font-medium mb-6">Apply for your next big role.</p>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">{job.title}</h2>
          <p className="opacity-90">{job.location}</p>
        </div>

        {/* Job Details */}
        <div className="bg-blue-950 p-6 sm:px-12 border-b border-blue-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h4 className="font-bold text-blue-900 uppercase tracking-wider text-xs mb-1">Salary</h4>
            <p className="text-blue-700 font-medium">{job.salaryRange || 'Not disclosed'}</p>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 uppercase tracking-wider text-xs mb-1">Location</h4>
            <p className="text-blue-700 font-medium">{job.location}</p>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 uppercase tracking-wider text-xs mb-1">Employment</h4>
            <p className="text-blue-700 font-medium">{job.jobType}</p>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 uppercase tracking-wider text-xs mb-1">Experience Req.</h4>
            <p className="text-blue-700 font-medium">{job.experienceLevel || 'Entry Level'}</p>
          </div>
        </div>

        {/* Success */}
        {submitted && (
          <div className="m-8 p-6 bg-green-50 border border-green-200 text-green-700 rounded-xl font-bold text-lg text-center animate-pulse">
            🎉 Your application has been submitted successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border border-slate-700 p-4 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
              <small className="text-red-500 font-medium block mt-1">{errors.fullName}</small>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full border border-slate-700 p-4 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
              <small className="text-red-500 font-medium block mt-1">{errors.email}</small>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Phone Number (Optional)</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full border border-slate-700 p-4 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
              <small className="text-red-500 font-medium block mt-1">{errors.phone}</small>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">College / University (Optional)</label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter your college"
                className="w-full border border-slate-700 p-4 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
              <small className="text-red-500 font-medium block mt-1">{errors.college}</small>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full border border-slate-700 p-4 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-slate-900"
              >
                <option value="">Select</option>
                <option value="fresher">Fresher</option>
                <option value="0-1 years">0-1 Years</option>
                <option value="1-3 years">1-3 Years</option>
                <option value="3-5 years">3-5 Years</option>
                <option value="5+ years">5+ Years</option>
              </select>
              <small className="text-red-500 font-medium block mt-1">{errors.experience}</small>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, CSS"
                className="w-full border border-slate-700 p-4 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
              <small className="text-red-500 font-medium block mt-1">{errors.skills}</small>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Cover Letter (Optional)</label>
            <textarea
              rows="4"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Tell us why you'd be a great fit for this role..."
              className="w-full border border-slate-700 p-4 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="bg-slate-950 border border-slate-700 p-6 sm:p-8 rounded-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <label className="block text-sm font-bold text-slate-300 mb-0">Resume Details</label>
            </div>
            
            {userInfo?.resumeUrl && (
              <p className="text-sm text-slate-300 mb-4 font-medium p-3 bg-blue-950 rounded-lg border border-blue-100">
                You already have a resume uploaded to your profile (
                <a href={`http://localhost:5000${userInfo.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Current Resume</a>
                ). You can optionally upload a new PDF here to replace it.
              </p>
            )}

            <p className="text-sm text-slate-400 mb-4 font-medium">
              Upload your PDF resume. Note: This will update the primary resume on your profile.
            </p>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-900 hover:bg-slate-800 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-3 text-slate-500" />
                <p className="mb-2 text-sm text-slate-400">
                  <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-400">PDF, DOC, DOCX (MAX. 5MB)</p>
                {resumeFile && <p className="mt-2 text-sm font-bold text-green-600">{resumeFile.name}</p>}
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="hidden"
              />
            </label>
            <small className="text-red-500 font-medium block mt-2">{errors.resumeFile}</small>
          </div>

          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-slate-800">
            <button
              type="button"
              className="w-full sm:w-auto px-8 py-4 font-bold text-slate-400 hover:text-gray-900 hover:bg-slate-700 rounded-xl transition-colors"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all shadow-lg transform active:scale-95"
              disabled={isSubmitting || submitted}
            >
              {isSubmitting ? "Applying..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;