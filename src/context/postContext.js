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

  const createLocalComment = (comment) => {
    setComments((previousComments) => {
      return [comment, ...previousComments];
    });
  };

  const updateLocalComment = (id, message) => {
    setComments((previousComments) => {
      return previousComments.map((comment) => {
        if (comment.id === id) {
          return { ...comment, message };
        } else {
          return comment;
        }
      });
    });
  };

  const toggleLocalCommentLike = (id, addLike) => {
    setComments((previousComments) => {
      return previousComments.map((comment) => {
        if (comment.id === id) {
          if (addLike) {
            return { ...comment, likeCount: comment.likeCount + 1, likeByMe: true };
          } else {
            return { ...comment, likeCount: comment.likeCount - 1, likeByMe: false };
          }
        } else {
          return comment;
        }
      });
    });
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
        createLocalComment,
        updateLocalComment,
        toggleLocalCommentLike
      }}>
      {loading ? <h1>Loading...</h1> : errors ? <h1 className="error-msg">{errors}</h1> : children}
    </Context.Provider>
  );
};

export const usePost = () => useContext(Context);
