import React from 'react';
import { usePost } from '../context/postContext';
import { useAsyncFn } from '../hooks/useAsync';
import { createComment } from '../services/comments';
import CommentForm from './commentForm';
import CommentsList from './CommentsList';
const Post = () => {
  const { post, rootComments } = usePost();
  const { loading, errors, execute } = useAsyncFn(createComment);

  const handleSubmit = (message) => {
    return execute({ postId: post.id, message });
  };

  return (
    <>
      <h1>{post.title}</h1>
      <article>{post.body}</article>
      <h3 className="comments-title">Comments</h3>
      <section>
        <CommentForm onSubmit={handleSubmit} loading={loading} error={errors} />
        {rootComments != null && rootComments.length > 0 && <CommentsList comments={rootComments}/>}
      </section>
    </>
  );
};

export default Post;
