import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand">The<span style={{ color: 'var(--accent)' }}>Ink</span>well</span>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Home</Link>
          <Link to="/posts" style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Archive</Link>
          <Link to="/write" style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Write</Link>
        </nav>
        <span className="footer__copy">© {new Date().getFullYear()} TheInkwell</span>
      </div>
    </footer>
  );
}
