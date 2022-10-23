import Axios from 'axios';

const api = Axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

export const makeRequest = (url, options) => {
  return api(url, options)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err?.response?.data?.message ?? 'Error'));
};
