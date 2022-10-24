import React, { useState } from 'react';
import { useAsyncFn } from '../hooks/useAsync';
import CommentForm from './commentForm';
import { toggleCommentLike, updateComment } from '../services/comments';
import { usePost } from '../context/postContext';
import IconBtn from './iconBtn';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});
const Comment = ({ createdAt, id, likeByMe, likeCount, message, parentId, user }) => {
  const [isEditting, setIsEditting] = useState(false);
  const updateCommentFn = useAsyncFn(updateComment);
  const toggleCommentLikeFn = useAsyncFn(toggleCommentLike);
  const { post, updateLocalComment, toggleLocalCommentLike } = usePost();

  const onCommentUpdate = (message) => {
    return updateCommentFn.execute({ postId: post.id, message, id }).then((comment) => {
      setIsEditting(false);
      updateLocalComment(id, comment.message);
    });
  };

  const onToggleCommentLike = () => {
    return toggleCommentLikeFn.execute({ id, postId: post.id }).then(({ addLike }) => toggleLocalCommentLike(id, addLike));
  };
  return (
    <>
      <div className="comment">
        <div className="header">
          <span className="name">{user.name}</span>
          <span className="date">{dateFormatter.format(Date.parse(createdAt))}</span>
        </div>

        {isEditting ? (
          <CommentForm autoFocus initialValue={message} onSubmit={onCommentUpdate} loading={updateCommentFn.loading} error={updateCommentFn.errors} />
        ) : (
          <div className="message">{message}</div>
        )}

        <div className="footer">
          <IconBtn aria-label={likeByMe ? 'Unlike' : 'Like'} Icon={likeByMe ? FaHeart : FaRegHeart} onClick={onToggleCommentLike} disabled={toggleCommentLikeFn.loading} />
        </div>
      </div>
    </>
  );
};

export default Comment;
