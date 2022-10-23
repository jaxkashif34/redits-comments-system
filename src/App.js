import { Routes, Route } from 'react-router-dom';
import PostList from './components/postList';
import Post from './components/post';
import { PostContext } from './context/postContext';
function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route
          path="/post/:id"
          element={
            <PostContext>
              <Post />
            </PostContext>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
