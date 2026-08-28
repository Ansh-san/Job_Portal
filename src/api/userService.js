import api from './axios';

const uploadResume = async (formData) => {
  const response = await api.post('/users/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const toggleSaveJob = async (jobId) => {
  const response = await api.post(`/users/save-job/${jobId}`);
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

const userService = {
  uploadResume,
  toggleSaveJob,
  updateProfile,
  getUserProfile,
};

export default userService;
