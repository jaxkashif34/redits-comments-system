import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { useParams } from 'react-router-dom';
import { getPost } from '../services/posts';
const Context = createContext();
export const PostContext = ({ children }) => {
  const { id } = useParams();
  const { loading, errors, value: post } = useAsync(() => getPost(id), [id]);
  const [comments, setComments] = useState([]);
  const commentByParentId = useMemo(() => {
    const group = {};
    comments.forEach((comment) => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [comments]);

  const getReplies = (parentId) => {
    return commentByParentId[parentId];
  };

  useEffect(() => {
    if (post?.comments == null) return;
    setComments(post?.comments);
  }, [post?.comments]);

  return (
    <Context.Provider
      value={{
        post: { id, ...post },
        rootComments: commentByParentId[null],
        getReplies,
      }}>
      {loading ? <h1>Loading...</h1> : errors ? <h1 className="error-msg">{errors}</h1> : children}
    </Context.Provider>
  );
};

export const usePost = () => useContext(Context);
