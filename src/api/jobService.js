import api from './axios';

// Get jobs with optional filters (page, limit, title, location, jobType, salaryRange)
const getJobs = async (filters = {}) => {
  const params = new URLSearchParams();
  for (const key in filters) {
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  }
  const response = await api.get(`/jobs?${params.toString()}`);
  return response.data;
};

const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

const updateJob = async (id, jobData) => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

const jobService = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};

export default jobService;
