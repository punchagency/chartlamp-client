import { API_KEY, HOST_API } from '@/config-global';
import axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    "api-key": API_KEY
  },
  withCredentials: true,
  timeout: 600000,
});

axiosInstance.interceptors.request.use(config => config);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !window.location.pathname.includes('auth')) {
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error.response?.data || 'Something went wrong');
  }
);

export default axiosInstance;
// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig?]): Promise<any> => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: "/api/chat",
  auth: {
    me: "/user/me",
    login: "/user/login",
    logout: "/user/logout",
    register: "/user/register",
    forgotPassword: "/user/forgot-password",
    resetPassword: "/user/reset-password",
    verifyOTP: "/user/verify-2fa",
    resendOTP: "/user/resend-2fa",
  },
  user: {
    getUser: "/user",
    recentlyJoined: "/user/recently-joined",
    update: "/user",
  },
  case: {
    create: "/case",
    getAll: "/case",
    getById: "/case",
    userCases: "/case/user",
    userStats: "/case/stats",
    mostVisited: "/case/most-visited",
    favoriteCases: "/case/favorites",
    lastViewed: "/case/last-viewed",
    detail: "/case",
    document: "/case/document",
    reports: {
      updateReport: "/case",
      claimRelated: "/case/reports/claim-related",
    },
  },
  dc: {
    getByIcdCode: "/dc/disease-classifications",
    getImagesByIcdCodes: "/dc/disease-classifications/icdCode/images",
  },
  invitation: {
    create: "/invitation",
    accept: "/invitation/accept",
    decline: "/invitation/decline",
    get: "/invitation",
  },
};