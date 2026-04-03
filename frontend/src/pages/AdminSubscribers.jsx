import { useState, useEffect } from 'react';
import { api } from '../api';

export default function AdminSubscribers() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    loadSubs();
  }, []);

  const loadSubs = () => api.get('/admin/subscribers').then(setSubs);

  const deleteSub = async (id) => {
    if (confirm('Delete subscriber?')) {
      await api.delete(`/admin/subscribers/${id}`);
      loadSubs();
    }
  };

  return (
    <div className="admin-subscribers">
      <h1>Manage Subscribers</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subs.map(sub => (
            <tr key={sub.id}>
              <td>{sub.email}</td>
              <td>{sub.name || '-'}</td>
              <td>{sub.active ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => deleteSub(sub.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}