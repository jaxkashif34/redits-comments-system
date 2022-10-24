import React from 'react';
import Comment from './comment';

const CommentsList = ({ comments }) => {
  return comments.map((comment) => {
    return (
      <div className="comment-stack" key={comment.id}>
        <Comment {...comment}/>
      </div>
    );
  });
};

export default CommentsList;
