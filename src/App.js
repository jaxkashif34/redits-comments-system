import { Routes, Route } from 'react-router-dom';
import PostList from './components/postList';
function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/post/:id" element={<h1>This is individual Post component</h1>} />
      </Routes>
    </div>
  );
}

export default App;
