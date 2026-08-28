import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jobService from '../api/jobService';
import applicationService from '../api/applicationService';
import userService from '../api/userService';
import toast from 'react-hot-toast';
import { JobDetailsSkeleton } from '../components/Skeleton';
import { Bookmark } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isSaved, setIsSaved] = useState(false);

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const isJobseeker = userInfo?.role === 'jobseeker';

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobService.getJobById(id);
        setJob(data);
      } catch (err) {
        setError('Job not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
    
    if (isJobseeker) {
      userService.getUserProfile().then(data => {
        if (data && data.savedJobs) {
          setIsSaved(data.savedJobs.some(j => (j._id || j) === id));
        }
      }).catch(err => console.error(err));
    }
  }, [id, isJobseeker]);

  const handleApply = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    navigate(`/apply/${id}`, { state: job });
  };

  const handleSaveJob = async () => {
    if (!isJobseeker) {
      toast.error('Please log in as a jobseeker to save jobs');
      return;
    }
    try {
      const res = await userService.toggleSaveJob(id);
      setIsSaved(res.savedJobs.some(j => (j._id || j) === id));
      toast.success(res.message);
    } catch (err) {
      toast.error('Failed to save job');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6">
      <JobDetailsSkeleton />
    </div>
  );
  
  if (error || !job) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl font-bold text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 sm:p-12 text-white">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 tracking-tight">{job.title}</h1>
          <p className="text-xl sm:text-2xl text-blue-100 font-semibold mb-8">{job.company}</p>
          
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 flex items-center">
              <span className="mr-2">📍</span> {job.location}
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 flex items-center">
              <span className="mr-2">💼</span> {job.jobType}
            </span>
            {job.salaryRange && (
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 flex items-center">
                <span className="mr-2">💰</span> {job.salaryRange}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12">
          <h2 className="text-2xl font-extrabold text-slate-100 mb-6">Job Description</h2>
          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-lg mb-10">
            {job.description}
          </div>

          <div className="border-t border-slate-800 pt-8">
            <p className="text-sm font-medium text-slate-500 mb-6">
              Posted on {new Date(job.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>



            <div className="flex items-center gap-4">
              {isJobseeker ? (
                <>
                  <button
                    onClick={handleApply}
                    className="flex-1 sm:flex-none sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all shadow-lg transform active:scale-95"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={handleSaveJob}
                    className={`flex items-center justify-center p-4 rounded-xl transition-all shadow-lg transform active:scale-95 ${isSaved ? 'bg-blue-900 text-blue-600 border-2 border-blue-800' : 'bg-slate-900 text-slate-400 hover:bg-slate-600 border-2 border-transparent'}`}
                    title={isSaved ? "Remove from saved" : "Save this job"}
                  >
                    <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                </>
              ) : userInfo ? (
                <p className="text-slate-400 font-medium italic bg-slate-950 p-4 rounded-lg w-full text-center sm:text-left">
                  Employers cannot apply for jobs. Please log in as a jobseeker.
                </p>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white font-bold text-lg rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 transition-all shadow-lg"
                >
                  Log in to Apply
                </button>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default JobDetails;
