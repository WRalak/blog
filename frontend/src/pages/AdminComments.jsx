import { useState, useEffect } from 'react';
import { api } from '../api';

export default function AdminComments() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = () => api.get('/admin/comments').then(setComments);

  const approveComment = async (id, approved) => {
    await api.put(`/admin/comments/${id}`, { approved });
    loadComments();
  };

  const deleteComment = async (id) => {
    if (confirm('Delete comment?')) {
      await api.delete(`/admin/comments/${id}`);
      loadComments();
    }
  };

  return (
    <div className="admin-comments">
      <h1>Manage Comments</h1>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Author</th>
            <th>Body</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map(comment => (
            <tr key={comment.id}>
              <td>{comment.post_title}</td>
              <td>{comment.author_name}</td>
              <td>{comment.body.slice(0, 50)}...</td>
              <td>{comment.approved ? 'Yes' : 'No'}</td>
              <td>
                {!comment.approved && <button onClick={() => approveComment(comment.id, true)}>Approve</button>}
                <button onClick={() => deleteComment(comment.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}