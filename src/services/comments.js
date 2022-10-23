import { makeRequest } from './makeRequest';

export const createComment = ({ postId, message, parentId }) => {
  return makeRequest(`/posts/${postId}/comments`, {
    method: 'POST',
    data: { message, parentId },
  });
};
