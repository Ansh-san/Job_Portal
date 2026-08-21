import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../api/jobService';
import toast from 'react-hot-toast';
import { CardSkeleton } from '../components/Skeleton';
import { Briefcase, MapPin, DollarSign, Search } from 'lucide-react';

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
    // Add a slight debounce to prevent fetching on every keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchJobs]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="animate-fade-in relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-primary-100/30 -z-10" />
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-200/40 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 -ml-20 w-80 h-80 rounded-full bg-blue-200/40 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Header & Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Discover Your Next <span className="text-primary-600">Great Opportunity</span>
          </h1>
          <p className="text-lg text-slate-600">
            Browse through thousands of job listings from top companies and kickstart your career.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="glass p-6 sm:p-8 rounded-3xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="title"
                value={filters.title}
                onChange={handleFilterChange}
                placeholder="Job title or keyword"
                className="input-field pl-11"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="input-field pl-11 appearance-none"
              >
                <option value="">Any Location</option>
                <option value="New York">New York</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleFilterChange}
                className="input-field pl-11 appearance-none"
              >
                <option value="">Any Type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="salaryRange"
                value={filters.salaryRange}
                onChange={handleFilterChange}
                placeholder="Salary (e.g., 50k)"
                className="input-field pl-11"
              />
            </div>
          </div>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => <CardSkeleton key={n} />)}
          </div>
        ) : error ? (
          <div className="glass p-12 text-center rounded-3xl">
            <p className="text-red-500 font-medium text-lg">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass p-16 text-center rounded-3xl space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No jobs found</h3>
            <p className="text-slate-500">Try adjusting your search filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <div 
                key={job._id} 
                className="glass rounded-2xl p-6 flex flex-col h-full card-hover animate-slide-up"
                style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center border border-primary-100">
                      <span className="text-primary-700 font-bold text-xl">{job.company.charAt(0)}</span>
                    </div>
                    <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {job.jobType}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1">{job.title}</h3>
                  <p className="text-slate-500 font-medium mb-6">{job.company}</p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin size={16} className="mr-2 text-slate-400" />
                      {job.location}
                    </div>
                    {job.salaryRange && (
                      <div className="flex items-center text-sm text-slate-600">
                        <DollarSign size={16} className="mr-2 text-slate-400" />
                        {job.salaryRange}
                      </div>
                    )}
                  </div>
                </div>
                
                <Link 
                  to={`/jobs/${job._id}`}
                  className="w-full text-center py-2.5 rounded-xl bg-slate-50 text-primary-600 font-semibold border border-slate-200 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-200"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 pt-4 pb-12">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="btn-secondary disabled:opacity-50 disabled:pointer-events-none"
            >
              Previous
            </button>
            <span className="text-slate-600 font-medium px-4">
              Page <span className="font-bold text-slate-900">{page}</span> of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="btn-secondary disabled:opacity-50 disabled:pointer-events-none"
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
