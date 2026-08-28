import React, { useState, useEffect, useRef } from 'react';
import applicationService from '../api/applicationService';
import userService from '../api/userService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ListSkeleton } from '../components/Skeleton';
import { Briefcase, MapPin, DollarSign, UploadCloud, X } from 'lucide-react';

const JobseekerDashboard = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const fileInputRef = useRef(null);
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const [formData, setFormData] = useState({
    phone: '',
    bio: '',
    skills: ''
  });

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  useEffect(() => {
    fetchApplications();
    fetchProfile();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const data = await userService.getUserProfile();
      setUserProfile(data);
      setFormData({
        phone: data.phone || '',
        bio: data.bio || '',
        skills: data.skills ? data.skills.join(', ') : ''
      });
    } catch (err) {
      console.error('Failed to fetch profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setUploadMessage('Only PDF files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploading(true);
      setUploadMessage('');
      const res = await userService.uploadResume(formData);
      setUploadMessage('Resume parsed & uploaded successfully!');
      toast.success('Resume parsed & profile auto-filled!');
      
      const freshUser = { ...userInfo, resumeUrl: res.resumeUrl };
      localStorage.setItem('userInfo', JSON.stringify(freshUser));
      
      // Auto-fill the form with AI extracted data
      if (res.user) {
        setFormData(prev => ({
          ...prev,
          bio: res.user.bio || prev.bio,
          skills: res.user.skills && res.user.skills.length > 0 ? res.user.skills.join(', ') : prev.skills
        }));
      }

      fetchProfile();
      
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Upload failed.';
      setUploadMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(formData);
      toast.success('Profile updated successfully!');
      fetchProfile();
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await userService.toggleSaveJob(jobId);
      toast.success('Job removed from saved');
      fetchProfile(); // refresh saved jobs
    } catch (err) {
      toast.error('Failed to unsave job');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
          <h1 className="text-3xl font-extrabold mb-2">Welcome, {userInfo?.name || 'Job Seeker'}!</h1>
          <p className="text-blue-100 font-medium">Manage your applications, saved jobs, and profile.</p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto space-x-2 border-b border-slate-700">
          <button 
            onClick={() => setActiveTab('applications')}
            className={`whitespace-nowrap px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-4 ${activeTab === 'applications' ? 'border-blue-600 text-blue-600 bg-blue-900/50' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            My Applications
          </button>
          <button 
            onClick={() => setActiveTab('savedJobs')}
            className={`whitespace-nowrap px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-4 ${activeTab === 'savedJobs' ? 'border-blue-600 text-blue-600 bg-blue-900/50' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            Saved Jobs
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`whitespace-nowrap px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-4 ${activeTab === 'profile' ? 'border-blue-600 text-blue-600 bg-blue-900/50' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            My Profile
          </button>
        </div>

        {activeTab === 'applications' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Application History</h2>
              
              {loading ? (
                <div>{[1, 2, 3].map(n => <ListSkeleton key={n} />)}</div>
              ) : applications.length === 0 ? (
                <div className="text-slate-400 text-center py-10 font-medium">You haven't applied to any jobs yet. <Link to="/" className="text-blue-600 hover:underline">Browse jobs</Link></div>
              ) : (
                <div className="space-y-4">
                  {applications.map(app => (
                    <div key={app._id} className="p-6 border border-slate-800 rounded-xl hover:shadow-md transition-shadow bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-bold text-xl text-slate-100 hover:text-blue-600 transition-colors">
                          {app.job ? <Link to={`/jobs/${app.job._id}`}>{app.job.title}</Link> : 'Job no longer available'}
                        </h3>
                        {app.job && <p className="text-blue-600 font-bold mt-1">{app.job.company}</p>}
                        <p className="text-sm font-medium text-slate-400 mt-2">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider
                          ${app.status === 'applied' ? 'bg-blue-900 text-blue-800 border border-blue-800' : ''}
                          ${app.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : ''}
                          ${app.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' : ''}
                          ${app.status === 'hired' ? 'bg-green-100 text-green-800 border border-green-200' : ''}
                        `}>
                          {app.status}
                        </span>
                        {app.matchScore !== undefined && (
                          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                            {app.matchScore}% Match
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'savedJobs' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Saved Jobs</h2>
              
              {profileLoading ? (
                <div>{[1, 2].map(n => <ListSkeleton key={n} />)}</div>
              ) : !userProfile?.savedJobs || userProfile.savedJobs.length === 0 ? (
                <div className="text-slate-400 text-center py-10 font-medium">You haven't saved any jobs yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userProfile.savedJobs.map(job => (
                    <div key={job._id} className="border border-slate-700 rounded-xl p-5 hover:shadow-lg transition-all bg-slate-900 relative">
                      <h3 className="font-bold text-lg text-slate-100 line-clamp-1">
                        <Link to={`/jobs/${job._id}`} className="hover:text-blue-600">{job.title}</Link>
                      </h3>
                      <p className="text-blue-600 font-semibold text-sm mb-3">{job.company}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-slate-400">
                          <MapPin size={14} className="mr-2" /> {job.location}
                        </div>
                        {job.salaryRange && (
                          <div className="flex items-center text-sm text-slate-400">
                            <DollarSign size={14} className="mr-2" /> {job.salaryRange}
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => handleUnsaveJob(job._id)}
                        className="text-red-500 text-sm font-bold hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg w-full transition-colors"
                      >
                        Remove from Saved
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">Resume</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-300 mb-3">Upload New Resume (PDF only)</label>
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploading ? 'bg-slate-900 border-slate-600' : 'bg-slate-900 border-blue-700 hover:bg-blue-50'}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 mb-3 text-blue-500" />
                      <p className="mb-2 text-sm text-slate-400">
                        <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-400">PDF ONLY</p>
                    </div>
                    <input 
                      type="file" 
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploading && <p className="text-blue-600 font-medium text-sm animate-pulse">Uploading securely...</p>}
                {uploadMessage && <p className={`text-sm font-bold ${uploadMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{uploadMessage}</p>}
                
                {userProfile?.resumeUrl && (
                  <div className="mt-6 p-4 bg-slate-950 rounded-xl border border-slate-700">
                    <p className="text-sm font-medium text-slate-400 mb-2">Current Resume Active:</p>
                    <a 
                      href={`http://localhost:5000${userProfile.resumeUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-bold underline"
                    >
                      View Current Resume
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">Profile Details</h2>
                {profileLoading ? (
                  <ListSkeleton />
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
                        <input type="text" disabled value={userProfile?.name || ''} className="w-full border border-slate-700 p-3 rounded-xl bg-slate-950 text-slate-400 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
                        <input type="text" disabled value={userProfile?.email || ''} className="w-full border border-slate-700 p-3 rounded-xl bg-slate-950 text-slate-400 outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number</label>
                        <input 
                          type="text" 
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          placeholder="e.g. +1 234 567 8900"
                          className="w-full border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Professional Bio</label>
                        <textarea 
                          value={formData.bio}
                          onChange={e => setFormData({...formData, bio: e.target.value})}
                          placeholder="Tell employers about yourself..."
                          rows="4"
                          className="w-full border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Skills (comma separated)</label>
                        <input 
                          type="text" 
                          value={formData.skills}
                          onChange={e => setFormData({...formData, skills: e.target.value})}
                          placeholder="e.g. React, Node.js, Python, Leadership"
                          className="w-full border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md mt-4">
                      Save Profile Updates
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default JobseekerDashboard;
