import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const extractError = (error, defaultMessage) => {
  const serverError = error.response?.data?.error || error.response?.data?.message;
  const msg = serverError || error.message || defaultMessage;
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
