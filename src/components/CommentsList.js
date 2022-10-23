import React from 'react';

const CommentsList = ({ comments }) => {
  return comments.map((comment) => {
    return <h5 key={comment.id}>{comment.message}</h5>;
  });
};

export default CommentsList;
