import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me').then(setUser).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);

  const login = async (email, password) => {
    const { user, token } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const register = async (data) => {
    const { user, token } = await api.post('/auth/register', data);
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const logout = () => { localStorage.removeItem('token'); setUser(null); };

  return <AuthCtx.Provider value={{ user, loading, login, register, logout }}>{children}</AuthCtx.Provider>;
}
