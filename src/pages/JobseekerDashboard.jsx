import React, { useState, useEffect } from 'react';
import applicationService from '../api/applicationService';
import userService from '../api/userService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ListSkeleton } from '../components/Skeleton';

const JobseekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await applicationService.getMyApplications();
        setApplications(data);
      } catch (err) {
        setError('Failed to fetch applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

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
      setUploadMessage('Resume uploaded successfully!');
      toast.success('Resume uploaded successfully!');
      
      // Update local storage user info with new resume url
      const updatedUser = { ...userInfo, ...res.user, token: userInfo.token }; 
      // the api returns { message, resumeUrl, user }. We just need to update the top level user info if stored that way.
      // Wait, our localstorage userInfo is {_id, name, email, role, token}.
      // The uploadResume returns updated `user` object. We can just inject the new resumeUrl.
      const freshUser = { ...userInfo, resumeUrl: res.resumeUrl };
      localStorage.setItem('userInfo', JSON.stringify(freshUser));
      
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Upload failed.';
      setUploadMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
          <h1 className="text-3xl font-extrabold mb-2">Welcome, {userInfo?.name || 'Job Seeker'}!</h1>
          <p className="text-blue-100 font-medium">Manage your applications and update your resume.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Resume Upload Section */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Resume</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Upload New Resume (PDF only, Max 5MB)</label>
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                />
              </div>

              {uploading && <p className="text-blue-600 font-medium text-sm animate-pulse">Uploading securely...</p>}
              {uploadMessage && <p className={`text-sm font-bold ${uploadMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{uploadMessage}</p>}
              
              {userInfo?.resumeUrl && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Current Resume Active:</p>
                  <a 
                    href={`http://localhost:5000${userInfo.resumeUrl}`} 
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

          {/* Applications List */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h2>
              
              {loading ? (
                <div>
                  {[1, 2, 3].map(n => <ListSkeleton key={n} />)}
                </div>
              ) : error ? (
                <div className="text-red-500 font-medium">{error}</div>
              ) : applications.length === 0 ? (
                <div className="text-gray-500 text-center py-10 font-medium">You haven't applied to any jobs yet. <Link to="/" className="text-blue-600 hover:underline">Browse jobs</Link></div>
              ) : (
                <div className="space-y-4">
                  {applications.map(app => (
                    <div key={app._id} className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-gray-50/50">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors">
                            {app.job ? <Link to={`/jobs/${app.job._id}`}>{app.job.title}</Link> : 'Job no longer available'}
                          </h3>
                          {app.job && <p className="text-blue-600 font-bold mt-1">{app.job.company}</p>}
                          <p className="text-sm font-medium text-gray-500 mt-2">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider
                            ${app.status === 'applied' ? 'bg-blue-100 text-blue-800 border border-blue-200' : ''}
                            ${app.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : ''}
                            ${app.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' : ''}
                            ${app.status === 'hired' ? 'bg-green-100 text-green-800 border border-green-200' : ''}
                          `}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobseekerDashboard;
