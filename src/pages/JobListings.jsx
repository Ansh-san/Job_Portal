import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../api/jobService';
import toast from 'react-hot-toast';
import { CardSkeleton } from '../components/Skeleton';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    jobType: '',
    salaryRange: ''
  });

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await jobService.getJobs({ ...filters, page, limit: 9 });
      setJobs(res.jobs || []);
      setTotalPages(res.pages || 1);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Filters */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Find Your Next Job</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              placeholder="Search by title..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
              <option value="">Any Location</option>
              <option value="New York">New York</option>
              <option value="San Francisco">San Francisco</option>
              <option value="Remote">Remote</option>
            </select>
            
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
              <option value="">Any Type</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
            
            <input
              type="text"
              name="salaryRange"
              value={filters.salaryRange}
              onChange={handleFilterChange}
              placeholder="Salary range (e.g., 50k)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => <CardSkeleton key={n} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">No jobs found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div key={job._id} className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <p className="text-blue-600 font-semibold mb-4">{job.company}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <span className="bg-gray-100 px-3 py-1 rounded-md">{job.jobType}</span>
                      <span className="flex items-center"><span className="mr-1">📍</span>{job.location}</span>
                    </div>
                    {job.salaryRange && (
                      <div className="text-sm text-gray-600 font-medium flex items-center">
                        <span className="mr-1">💰</span> {job.salaryRange}
                      </div>
                    )}
                  </div>
                </div>
                
                <Link 
                  to={`/jobs/${job._id}`}
                  className="mt-auto block w-full text-center px-4 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 pt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-5 py-2 border border-gray-200 rounded-xl font-semibold disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-600 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-5 py-2 border border-gray-200 rounded-xl font-semibold disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default JobListings;
