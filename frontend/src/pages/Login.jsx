import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', bio: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError(''); setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      navigate('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
        <p>{mode === 'login' ? 'Sign in to write and manage posts.' : 'Join TheInkwell and start writing.'}</p>

        {error && <div className="error">{error}</div>}

        {mode === 'register' && (
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" />
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com"
            onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>
        {mode === 'register' && (
          <div className="form-group">
            <label>Bio (optional)</label>
            <input value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell readers a little about yourself" />
          </div>
        )}

        <button className="btn btn-primary" onClick={submit} disabled={loading}
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}>
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: 'var(--muted)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit', fontFamily: 'inherit' }}>
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
