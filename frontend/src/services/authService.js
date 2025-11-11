import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data.data;
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data.data;
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data.data;
};

const updateProfile = async (userData) => {
  const response = await api.put('/auth/profile', userData);
  return response.data.data;
};

const changePassword = async (passwordData) => {
  const response = await api.put('/auth/change-password', passwordData);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
};

export default authService;


