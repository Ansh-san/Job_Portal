import api from './axios';

const uploadResume = async (formData) => {
  const response = await api.post('/users/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const userService = {
  uploadResume,
};

export default userService;
