import React, { useState, useEffect } from 'react';
import jobService from '../api/jobService';
import applicationService from '../api/applicationService';
import userService from '../api/userService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TableSkeleton, ListSkeleton } from '../components/Skeleton';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  
  // Job State
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  
  // Create Job Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    title: '', description: '', company: '', location: '', salaryRange: '', jobType: 'full-time'
  });

  // Applicants State
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  // Profile State
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileFormData, setProfileFormData] = useState({
    companyName: '',
    companyDescription: '',
    website: ''
  });

  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  useEffect(() => {
    fetchJobs();
    fetchProfile();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const data = await applicationService.getEmployerAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

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

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const data = await userService.getUserProfile();
      setUserProfile(data);
      setProfileFormData({
        companyName: data.companyName || '',
        companyDescription: data.companyDescription || '',
        website: data.website || ''
      });
      // Pre-fill company name in job form if not set
      setJobFormData(prev => ({...prev, company: data.companyName || prev.company}));
    } catch (err) {
      console.error('Failed to fetch profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(profileFormData);
      toast.success('Company Profile updated successfully!');
      fetchProfile();
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await jobService.createJob(jobFormData);
      setShowCreateForm(false);
      setJobFormData({ title: '', description: '', company: userProfile?.companyName || '', location: '', salaryRange: '', jobType: 'full-time' });
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

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId; 
    const appId = draggableId;

    // Optimistically update state
    const updatedApplicants = applicants.map(app => {
      if (app._id === appId) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    setApplicants(updatedApplicants);

    try {
      await applicationService.updateApplicationStatus(appId, newStatus);
      toast.success(`Moved to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
    } catch (err) {
      toast.error('Failed to update status');
      // Revert state if failed
      fetchApplicants(selectedJobId);
    }
  };

  // Define Kanban columns based on allowed backend statuses
  const kanbanColumns = [
    { id: 'applied', title: 'Applied', headerColor: 'bg-blue-900 text-blue-800 border-blue-800' },
    { id: 'shortlisted', title: 'Shortlisted', headerColor: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { id: 'hired', title: 'Hired 🎉', headerColor: 'bg-green-100 text-green-800 border-green-200' },
    { id: 'rejected', title: 'Rejected', headerColor: 'bg-red-100 text-red-800 border-red-200' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 to-gray-700 text-white gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Employer Dashboard</h1>
            <p className="text-gray-300 font-medium mt-2">Manage your job postings, applicants, and company profile.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-center min-w-[120px]">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Jobs</p>
              <p className="text-2xl font-bold">{jobs.length}</p>
            </div>
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-center min-w-[120px]">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Company</p>
              <p className="text-md font-bold truncate max-w-[100px]">{userProfile?.companyName || userInfo?.name}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto space-x-2 border-b border-slate-700">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`whitespace-nowrap px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-4 ${activeTab === 'jobs' ? 'border-blue-600 text-blue-600 bg-blue-900/50' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            My Job Postings
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`whitespace-nowrap px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-4 ${activeTab === 'analytics' ? 'border-purple-600 text-purple-600 bg-purple-50/50' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            Analytics Overview
          </button>
          <button 
            onClick={() => setActiveTab('applicants')}
            className={`whitespace-nowrap px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-4 ${activeTab === 'applicants' ? 'border-blue-600 text-blue-600 bg-blue-900/50' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            ATS Kanban Board
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`whitespace-nowrap px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-4 ${activeTab === 'profile' ? 'border-blue-600 text-blue-600 bg-blue-900/50' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            Company Profile
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
              <form onSubmit={handleCreateJob} className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
                <h3 className="md:col-span-2 text-xl font-bold text-slate-100 border-b pb-4 mb-2">Post a New Position</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Job Title *</label>
                  <input required type="text" placeholder="e.g. Senior React Developer" className="w-full border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={jobFormData.title} onChange={e => setJobFormData({...jobFormData, title: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Company Name *</label>
                  <input required type="text" placeholder="e.g. Acme Corp" className="w-full border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={jobFormData.company} onChange={e => setJobFormData({...jobFormData, company: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Location *</label>
                  <input required type="text" placeholder="e.g. New York, NY or Remote" className="w-full border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={jobFormData.location} onChange={e => setJobFormData({...jobFormData, location: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Salary Range</label>
                  <input type="text" placeholder="e.g. $100k - $130k" className="w-full border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={jobFormData.salaryRange} onChange={e => setJobFormData({...jobFormData, salaryRange: e.target.value})} />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Job Type *</label>
                  <select className="w-full border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-900" value={jobFormData.jobType} onChange={e => setJobFormData({...jobFormData, jobType: e.target.value})}>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Job Description *</label>
                  <textarea required placeholder="Detailed description of the role, requirements, and benefits..." className="w-full border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" rows="5" value={jobFormData.description} onChange={e => setJobFormData({...jobFormData, description: e.target.value})}></textarea>
                </div>
                
                <button type="submit" className="md:col-span-2 bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-md">Publish Job Posting</button>
              </form>
            )}

            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
              {jobsLoading ? (
                 <TableSkeleton />
              ) : jobs.length === 0 ? <p className="text-slate-400 text-center py-10 font-medium">You haven't posted any jobs yet.</p> : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-950">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider rounded-tl-lg">Job Title</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-slate-900">
                      {jobs.map(job => (
                        <tr key={job._id} className="hover:bg-slate-800 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap font-bold text-slate-100">
                            <Link to={`/jobs/${job._id}`} className="hover:text-blue-600 hover:underline">{job.title}</Link>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-400">{job.location}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-400">
                            <span className="bg-slate-900 px-3 py-1 rounded-md">{job.jobType}</span>
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {analyticsLoading ? (
              <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800 flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : analytics ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col items-center justify-center text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">Total Jobs</p>
                    <p className="text-4xl font-extrabold text-slate-100">{analytics.totalJobs}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col items-center justify-center text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">Total Candidates</p>
                    <p className="text-4xl font-extrabold text-blue-600">{analytics.totalApplications}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col items-center justify-center text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">Successful Hires</p>
                    <p className="text-4xl font-extrabold text-green-500">{analytics.statusCounts.hired || 0}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pipeline Funnel */}
                  <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800">
                    <h3 className="text-xl font-bold text-slate-100 mb-6 border-b pb-4">Hiring Pipeline</h3>
                    <div className="h-[300px]">
                      {analytics.funnelData && analytics.funnelData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontWeight: 'bold'}} />
                            <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                              {analytics.funnelData.map((entry, index) => {
                                const colors = ['#3b82f6', '#eab308', '#22c55e'];
                                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                              })}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-500 font-medium">No application data yet</div>
                      )}
                    </div>
                  </div>

                  {/* Applications Over Time */}
                  <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800">
                    <h3 className="text-xl font-bold text-slate-100 mb-6 border-b pb-4">Applications Velocity (30 Days)</h3>
                    <div className="h-[300px]">
                      {analytics.timelineData && analytics.timelineData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analytics.timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                            <Area type="monotone" dataKey="applications" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-500 font-medium">No timeline data yet</div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-slate-900 p-10 rounded-2xl shadow-sm border border-slate-800 text-center text-slate-400">Failed to load analytics</div>
            )}
          </div>
        )}

        {/* Kanban Applicants Tab */}
        {activeTab === 'applicants' && (
          <div className="bg-transparent space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
              <label className="block text-sm font-bold text-slate-300 mb-3">Select a Job to view its applicants</label>
              <select 
                className="w-full md:w-1/2 border-2 border-slate-700 p-4 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none text-slate-300 font-semibold bg-slate-900 shadow-sm"
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
              <>
                {applicantsLoading ? (
                  <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800">
                    {[1, 2, 3].map(n => <ListSkeleton key={n} />)}
                  </div>
                ) : applicants.length === 0 ? (
                  <div className="bg-slate-900 p-16 rounded-2xl shadow-sm border border-dashed border-slate-600 text-center">
                    <p className="text-slate-400 font-medium text-lg">No one has applied for this position yet.</p>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
                      {kanbanColumns.map(column => {
                        const columnApplicants = applicants.filter(app => app.status === column.id);
                        
                        return (
                          <div key={column.id} className="flex flex-col h-full bg-gray-100/50 rounded-2xl overflow-hidden border border-slate-700">
                            <div className={`p-4 border-b font-bold flex justify-between items-center ${column.headerColor}`}>
                              <span>{column.title}</span>
                              <span className="bg-white/50 px-2 py-1 rounded-md text-xs">{columnApplicants.length}</span>
                            </div>
                            
                            <Droppable droppableId={column.id}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className={`flex-grow p-4 min-h-[300px] transition-colors ${snapshot.isDraggingOver ? 'bg-blue-900/50' : ''}`}
                                >
                                  {columnApplicants.map((app, index) => (
                                    <Draggable key={app._id} draggableId={app._id} index={index}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`bg-slate-900 p-4 rounded-xl shadow-sm border mb-3 flex flex-col gap-3 transition-transform ${snapshot.isDragging ? 'shadow-xl scale-105 border-blue-700 rotate-1' : 'border-slate-700 hover:border-gray-300 hover:shadow-md'}`}
                                          style={{ ...provided.draggableProps.style }}
                                        >
                                          <div>
                                            <p className="font-extrabold text-slate-100 line-clamp-1">{app.applicant.name}</p>
                                            <p className="text-slate-400 font-medium text-xs truncate">📧 {app.applicant.email}</p>
                                          </div>
                                          
                                          <div className="flex gap-2">
                                            <span className="bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded text-[10px] uppercase tracking-wide">
                                              {app.matchScore}% Match
                                            </span>
                                            {app.experience && (
                                              <span className="bg-slate-900 text-slate-400 font-bold px-2 py-1 rounded text-[10px] uppercase tracking-wide">
                                                Exp: {app.experience}
                                              </span>
                                            )}
                                          </div>

                                          <div className="flex flex-wrap gap-2 mt-1 pt-3 border-t border-slate-800">
                                            {app.applicant.resumeUrl && (
                                              <a 
                                                href={`http://localhost:5000${app.applicant.resumeUrl}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex-1 text-center bg-blue-950 text-blue-600 hover:bg-blue-100 font-bold text-xs py-1.5 px-2 rounded transition-colors"
                                              >
                                                Resume
                                              </a>
                                            )}
                                            {app.coverLetter && (
                                              <button 
                                                onClick={() => alert(app.coverLetter)} 
                                                className="flex-1 text-center bg-slate-950 text-slate-400 hover:bg-slate-600 font-bold text-xs py-1.5 px-2 rounded transition-colors"
                                              >
                                                Letter
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        );
                      })}
                    </div>
                  </DragDropContext>
                )}
              </>
            )}
          </div>
        )}

        {/* Company Profile Tab */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800 max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Company Profile</h2>
              {profileLoading ? (
                <ListSkeleton />
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Company Name</label>
                    <input 
                      type="text" 
                      required
                      value={profileFormData.companyName}
                      onChange={e => setProfileFormData({...profileFormData, companyName: e.target.value})}
                      placeholder="e.g. Acme Corp"
                      className="w-full border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Company Website</label>
                    <input 
                      type="text" 
                      value={profileFormData.website}
                      onChange={e => setProfileFormData({...profileFormData, website: e.target.value})}
                      placeholder="e.g. https://www.acmecorp.com"
                      className="w-full border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Company Description</label>
                    <textarea 
                      value={profileFormData.companyDescription}
                      onChange={e => setProfileFormData({...profileFormData, companyDescription: e.target.value})}
                      placeholder="What does your company do?"
                      rows="5"
                      className="w-full border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  
                  <button type="submit" className="w-full px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md mt-4">
                    Save Company Profile
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployerDashboard;
