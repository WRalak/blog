import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar({ categories = [] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header>
      <div className="masthead">
        <div className="container masthead__inner">
          <Link to="/" className="masthead__title">The<span>Ink</span>well</Link>
          <nav className="masthead__nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/posts">Archive</NavLink>
            {user ? (
              <>
                <NavLink to="/write" className="btn-write">+ Write</NavLink>
                {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
                <a href="#" onClick={e => { e.preventDefault(); handleLogout(); }} style={{ color: 'var(--muted)' }}>Sign out</a>
              </>
            ) : (
              <NavLink to="/login" className="btn-write">Sign in</NavLink>
            )}
          </nav>
        </div>
      </div>
      {categories.length > 0 && (
        <div className="catbar">
          <div className="container catbar__inner">
            <NavLink to="/posts" end>All</NavLink>
            {categories.map(c => (
              <NavLink key={c.id} to={`/posts?category=${c.slug}`}>{c.name}</NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
