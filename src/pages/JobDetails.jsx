import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jobService from '../api/jobService';
import applicationService from '../api/applicationService';
import toast from 'react-hot-toast';
import { JobDetailsSkeleton } from '../components/Skeleton';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState(null);

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
  }, [id]);

  const handleApply = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    try {
      setApplyLoading(true);
      setApplyMessage(null);
      await applicationService.applyForJob(id);
      setApplyMessage({ type: 'success', text: 'Successfully applied for this job!' });
      toast.success('Successfully applied for this job!');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to apply. You may have already applied.';
      setApplyMessage({ type: 'error', text: errMsg });
      toast.error(errMsg);
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <JobDetailsSkeleton />
    </div>
  );
  
  if (error || !job) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl font-bold text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        
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
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Job Description</h2>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg mb-10">
            {job.description}
          </div>

          <div className="border-t border-gray-100 pt-8">
            <p className="text-sm font-medium text-gray-400 mb-6">
              Posted on {new Date(job.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {applyMessage && (
              <div className={`p-4 mb-6 rounded-xl font-medium ${applyMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {applyMessage.text}
              </div>
            )}

            <div className="flex items-center">
              {isJobseeker ? (
                <button
                  onClick={handleApply}
                  disabled={applyLoading || applyMessage?.type === 'success'}
                  className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all shadow-lg transform active:scale-95"
                >
                  {applyLoading ? 'Applying...' : applyMessage?.type === 'success' ? 'Applied Successfully' : 'Apply Now'}
                </button>
              ) : userInfo ? (
                <p className="text-gray-500 font-medium italic bg-gray-50 p-4 rounded-lg w-full text-center sm:text-left">
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
