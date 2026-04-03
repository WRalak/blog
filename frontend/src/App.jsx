import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import { AuthProvider } from './hooks/useAuth';
import { api } from './api';

import Navbar  from './components/Navbar';
import Footer  from './components/Footer';
import Home       from './pages/Home';
import PostList   from './pages/PostList';
import PostDetail from './pages/PostDetail';
import Write      from './pages/Write';
import Login      from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers     from './pages/AdminUsers';
import AdminPosts     from './pages/AdminPosts';
import AdminComments  from './pages/AdminComments';
import AdminSubscribers from './pages/AdminSubscribers';

export default function App() {
  const [categories, setCategories] = useState([]);

  useEffect(() => { api.get('/categories').then(setCategories).catch(() => {}); }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar categories={categories} />
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/posts"       element={<PostList />} />
          <Route path="/posts/:slug" element={<PostDetail />} />
          <Route path="/write"       element={<Write />} />
          <Route path="/write/:id"   element={<Write />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/admin"       element={<AdminDashboard />} />
          <Route path="/admin/users"     element={<AdminUsers />} />
          <Route path="/admin/posts"     element={<AdminPosts />} />
          <Route path="/admin/comments"  element={<AdminComments />} />
          <Route path="/admin/subscribers" element={<AdminSubscribers />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
