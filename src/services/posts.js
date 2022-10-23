import { makeRequest } from './makeRequest';

export const getPosts = () => {
  return makeRequest('/posts');
};
