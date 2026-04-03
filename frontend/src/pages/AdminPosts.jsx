import { useState, useEffect } from 'react';
import { api } from '../api';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = () => {
    const params = filter ? `?status=${filter}` : '';
    api.get(`/admin/posts${params}`).then(setPosts);
  };

  const updatePost = async (id, updates) => {
    await api.put(`/admin/posts/${id}`, updates);
    loadPosts();
  };

  const deletePost = async (id) => {
    if (confirm('Delete post?')) {
      await api.delete(`/admin/posts/${id}`);
      loadPosts();
    }
  };

  return (
    <div className="admin-posts">
      <h1>Manage Posts</h1>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="">All</option>
        <option value="draft">Drafts</option>
        <option value="published">Published</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.author_name}</td>
              <td>
                <select
                  value={post.status}
                  onChange={(e) => updatePost(post.id, { status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </td>
              <td>
                <button onClick={() => deletePost(post.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}