import { useState, useEffect } from 'react';
import { api } from '../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => api.get('/admin/users').then(setUsers);

  const updateUser = async (id, updates) => {
    await api.put(`/admin/users/${id}`, updates);
    loadUsers();
    setEditing(null);
  };

  const deleteUser = async (id) => {
    if (confirm('Delete user?')) {
      await api.delete(`/admin/users/${id}`);
      loadUsers();
    }
  };

  return (
    <div className="admin-users">
      <h1>Manage Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {editing === user.id ? (
                  <select
                    value={user.role}
                    onChange={(e) => updateUser(user.id, { role: e.target.value })}
                  >
                    <option value="author">Author</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editing === user.id ? (
                  <button onClick={() => setEditing(null)}>Cancel</button>
                ) : (
                  <>
                    <button onClick={() => setEditing(user.id)}>Edit</button>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}