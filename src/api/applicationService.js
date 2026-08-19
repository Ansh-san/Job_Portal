import api from './axios';

const applyForJob = async (jobId) => {
  const response = await api.post(`/applications/${jobId}`);
  return response.data;
};

const getMyApplications = async () => {
  const response = await api.get('/applications/me');
  return response.data;
};

const getJobApplicants = async (jobId) => {
  const response = await api.get(`/applications/job/${jobId}`);
  return response.data;
};

const updateApplicationStatus = async (id, status) => {
  const response = await api.patch(`/applications/${id}/status`, { status });
  return response.data;
};

const applicationService = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
};

export default applicationService;
