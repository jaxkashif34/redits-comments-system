import React, { useState } from 'react';
import { useAsyncFn } from '../hooks/useAsync';
import CommentForm from './commentForm';
import { createComment, deleteComment, toggleCommentLike, updateComment } from '../services/comments';
import { usePost } from '../context/postContext';
import CommentList from './CommentsList';
import IconBtn from './iconBtn';
import { FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash } from 'react-icons/fa';
import { useUser } from '../hooks/useUser';
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});
const Comment = ({ createdAt, id, likeByMe, likeCount, message, user }) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const updateCommentFn = useAsyncFn(updateComment);
  const createCommentFn = useAsyncFn(createComment);
  const deleteCommentFn = useAsyncFn(deleteComment);
  const toggleCommentLikeFn = useAsyncFn(toggleCommentLike);
  const { post, updateLocalComment, toggleLocalCommentLike, createLocalComment, getReplies, deleteLocalComment } = usePost();
  const childComments = getReplies(id);
  const currentUser = useUser();

  const onCommentUpdate = (message) => {
    return updateCommentFn.execute({ postId: post.id, message, id }).then((comment) => {
      setIsEditting(false);
      updateLocalComment(id, comment.message);
    });
  };

  const onCommentReply = (message) => {
    return createCommentFn.execute({ postId: post.id, message, parentId: id }).then((comment) => {
      setIsReplaying(false);
      createLocalComment(comment);
    });
  };

  const onDeleteComment = () => {
    return deleteCommentFn.execute({ postId: post.id, id }).then((comment) => deleteLocalComment(comment.id));
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
          <IconBtn aria-label={likeByMe ? 'Unlike' : 'Like'} Icon={likeByMe ? FaHeart : FaRegHeart} onClick={onToggleCommentLike} disabled={toggleCommentLikeFn.loading}>
            {likeCount}
          </IconBtn>
          <IconBtn aria-label={isReplaying ? 'Cancel Reply' : 'Reply'} Icon={FaReply} onClick={() => setIsReplaying((prev) => !prev)} isActive={isReplaying} />
          {user.id === currentUser.id && (
            <>
              <IconBtn isActive={isEditting} Icon={FaEdit} aria-label={isEditting ? 'Cancel Edit' : 'Edit'} onClick={() => setIsEditting((prev) => !prev)} />
              <IconBtn Icon={FaTrash} color="danger" aria-label="Delete" onClick={onDeleteComment} />
            </>
          )}
        </div>
      </div>
      {isReplaying && (
        <div className="mt-1 ml-3">
          <CommentForm autoFocus onSubmit={onCommentReply} loading={createCommentFn.loading} error={createCommentFn.errors} />
        </div>
      )}
      {childComments?.length > 0 && (
        <>
          <div className={`nested-comments-stack ${areChildrenHidden && 'hide'}`}>
            <button className="collapse-line" aria-label="Hide Replies" onClick={() => setAreChildrenHidden(true)} />
            <div className="nested-comments">
              <CommentList comments={childComments} />
            </div>
          </div>
          <button className={`btn mt-1 ${!areChildrenHidden && 'hide'}`} onClick={() => setAreChildrenHidden(false)}>
            Show Replies
          </button>
        </>
      )}
    </>
  );
};

export default Comment;
