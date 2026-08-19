import React, { useState, useEffect } from 'react';
import jobService from '../api/jobService';
import applicationService from '../api/applicationService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TableSkeleton, ListSkeleton } from '../components/Skeleton';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  
  // Job State
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  
  // Create Job Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', company: '', location: '', salaryRange: '', jobType: 'full-time'
  });

  // Applicants State
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      const res = await jobService.getJobs({ postedBy: userInfo?._id });
      setJobs(res.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await jobService.createJob(formData);
      setShowCreateForm(false);
      setFormData({ title: '', description: '', company: '', location: '', salaryRange: '', jobType: 'full-time' });
      toast.success('Job posted successfully!');
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
      console.error(err);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) {
      try {
        await jobService.deleteJob(id);
        toast.success('Job deleted successfully');
        fetchJobs();
      } catch (err) {
        toast.error('Failed to delete job');
        console.error(err);
      }
    }
  };

  const fetchApplicants = async (jobId) => {
    setSelectedJobId(jobId);
    if (!jobId) {
      setApplicants([]);
      return;
    }
    try {
      setApplicantsLoading(true);
      const res = await applicationService.getJobApplicants(jobId);
      setApplicants(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(appId, newStatus);
      toast.success('Status updated successfully');
      // Refresh applicants quietly
      const res = await applicationService.getJobApplicants(selectedJobId);
      setApplicants(res || []);
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 to-gray-700 text-white gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Employer Dashboard</h1>
            <p className="text-gray-300 font-medium mt-2">Manage your job postings and applicants efficiently.</p>
          </div>
          <p className="font-bold border border-gray-500 bg-gray-800 px-4 py-2 rounded-lg">{userInfo?.company || userInfo?.name}</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-4 ${activeTab === 'jobs' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            My Job Postings
          </button>
          <button 
            onClick={() => setActiveTab('applicants')}
            className={`px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-4 ${activeTab === 'applicants' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Manage Applicants
          </button>
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-end">
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
              >
                {showCreateForm ? 'Cancel Creation' : '➕ Create New Job'}
              </button>
            </div>

            {showCreateForm && (
              <form onSubmit={handleCreateJob} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
                <h3 className="md:col-span-2 text-xl font-bold text-gray-900 border-b pb-4 mb-2">Post a New Position</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                  <input required type="text" placeholder="e.g. Senior React Developer" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                  <input required type="text" placeholder="e.g. Acme Corp" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <input required type="text" placeholder="e.g. New York, NY or Remote" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Range</label>
                  <input type="text" placeholder="e.g. $100k - $130k" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.salaryRange} onChange={e => setFormData({...formData, salaryRange: e.target.value})} />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type *</label>
                  <select className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formData.jobType} onChange={e => setFormData({...formData, jobType: e.target.value})}>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
                  <textarea required placeholder="Detailed description of the role, requirements, and benefits..." className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" rows="5" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                
                <button type="submit" className="md:col-span-2 bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-md">Publish Job Posting</button>
              </form>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              {jobsLoading ? (
                 <TableSkeleton />
              ) : jobs.length === 0 ? <p className="text-gray-500 text-center py-10 font-medium">You haven't posted any jobs yet.</p> : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tl-lg">Job Title</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {jobs.map(job => (
                        <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap font-bold text-gray-900">
                            <Link to={`/jobs/${job._id}`} className="hover:text-blue-600 hover:underline">{job.title}</Link>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-500">{job.location}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-500">
                            <span className="bg-gray-100 px-3 py-1 rounded-md">{job.jobType}</span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-bold">
                            <button onClick={() => handleDeleteJob(job._id)} className="text-red-600 hover:text-red-900 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors ml-4">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Applicants Tab */}
        {activeTab === 'applicants' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8 animate-in fade-in duration-300">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
              <label className="block text-sm font-bold text-blue-900 mb-3">Select a Job to view its applicants</label>
              <select 
                className="w-full md:w-1/2 border-2 border-blue-200 p-4 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none text-gray-700 font-semibold bg-white shadow-sm"
                value={selectedJobId}
                onChange={(e) => fetchApplicants(e.target.value)}
              >
                <option value="">-- Choose a Job Posting --</option>
                {jobs.map(job => (
                  <option key={job._id} value={job._id}>{job.title}</option>
                ))}
              </select>
            </div>

            {selectedJobId && (
              <div className="pt-2">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center">
                  Applicant Pipeline <span className="ml-3 bg-blue-100 text-blue-700 text-sm py-1 px-3 rounded-full">{applicants.length} Total</span>
                </h3>
                
                {applicantsLoading ? (
                  <div>
                    {[1, 2].map(n => <ListSkeleton key={n} />)}
                  </div>
                ) : applicants.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                    <p className="text-gray-500 font-medium text-lg">No one has applied for this position yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applicants.map(app => (
                      <div key={app._id} className="p-6 border border-gray-200 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-6 hover:shadow-md transition-shadow bg-white">
                        <div className="flex-grow">
                          <p className="font-extrabold text-xl text-gray-900 mb-1">{app.applicant.name}</p>
                          <p className="text-gray-500 font-medium text-sm mb-3">📧 {app.applicant.email}</p>
                          {app.applicant.resumeUrl ? (
                            <a href={`http://localhost:5000${app.applicant.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold text-sm hover:underline bg-blue-50 px-4 py-2 rounded-lg inline-flex items-center transition-colors">
                              📄 View Resume
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm italic">No resume attached</span>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-start md:items-end gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100 min-w-[200px]">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Update Status</span>
                          <select 
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className={`w-full p-3 border-2 rounded-xl font-bold text-sm outline-none cursor-pointer appearance-none text-center
                              ${app.status === 'applied' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                              ${app.status === 'shortlisted' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                              ${app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                              ${app.status === 'hired' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                            `}
                          >
                            <option value="applied">Applied (Pending)</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired 🎉</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployerDashboard;
