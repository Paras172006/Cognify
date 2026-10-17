import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const extractError = (error, defaultMessage) => {
  const serverData = error.response?.data;
  let msg = '';

  if (typeof serverData === 'string') {
    if (serverData.includes('<!DOCTYPE') || serverData.includes('<html') || serverData.includes('<head')) {
      msg = error.response?.status === 405
        ? 'Service temporarily updating. Please refresh the page.'
        : defaultMessage;
    } else {
      msg = serverData;
    }
  } else if (serverData && typeof serverData === 'object') {
    if (typeof serverData.error === 'string') {
      msg = serverData.error;
    } else if (typeof serverData.message === 'string') {
      msg = serverData.message;
    } else if (serverData.error && typeof serverData.error.message === 'string') {
      msg = serverData.error.message;
    } else if (serverData.error) {
      msg = typeof serverData.error === 'object' ? JSON.stringify(serverData.error) : String(serverData.error);
    }
  } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    msg = 'Cannot connect to server. Please check your connection or wait 30s while backend starts.';
  } else if (typeof error.message === 'string') {
    msg = error.message;
  }

  msg = msg || defaultMessage;
  const err = new Error(msg);
  err.error = msg;
  err.statusCode = error.response?.status;
  return err;
};

const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw extractError(error, 'Failed to login');
  }
};

const register = async (username, email, password) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw extractError(error, 'Failed to register');
  }
};

const getProfile = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

const updateProfile = async (userData) => {
  try {
    const response = await axiosInstance.put(
      API_PATHS.AUTH.UPDATE_PROFILE,
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

const changePassword = async (passwords) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.AUTH.CHANGE_PASSWORD,
      passwords
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

const authService = {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
};

export default authService;
