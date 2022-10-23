import { makeRequest } from './makeRequest';

export const getPosts = () => {
  return makeRequest('/posts');
};

export const getPost = (id) => {
  return makeRequest(`/post/${id}`);
};
