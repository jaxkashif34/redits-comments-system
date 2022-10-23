import { getPosts } from '../services/posts';
import { useAsync } from '../hooks/useAsync';
import { Link } from 'react-router-dom';
const PostList = () => {
  const { value: posts, loading, errors } = useAsync(getPosts);

  if (errors) return <h1 className="error-msg">Something went wrong</h1>;
  if (loading) return <h1>Loading...</h1>;

  return posts.map((post) => (
    <h1 key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </h1>
  ));
};

export default PostList;
