import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Fetch stats
    Promise.all([
      api.get('/admin/users'),
      api.get('/admin/posts'),
      api.get('/admin/comments'),
      api.get('/admin/subscribers'),
    ]).then(([users, posts, comments, subs]) => {
      setStats({
        users: users.length,
        posts: posts.length,
        comments: comments.length,
        subscribers: subs.length,
      });
    }).catch(console.error);
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Users</h3>
          <p>{stats.users}</p>
          <Link to="/admin/users">Manage Users</Link>
        </div>
        <div className="stat-card">
          <h3>Posts</h3>
          <p>{stats.posts}</p>
          <Link to="/admin/posts">Manage Posts</Link>
        </div>
        <div className="stat-card">
          <h3>Comments</h3>
          <p>{stats.comments}</p>
          <Link to="/admin/comments">Manage Comments</Link>
        </div>
        <div className="stat-card">
          <h3>Subscribers</h3>
          <p>{stats.subscribers}</p>
          <Link to="/admin/subscribers">Manage Subscribers</Link>
        </div>
      </div>
    </div>
  );
}