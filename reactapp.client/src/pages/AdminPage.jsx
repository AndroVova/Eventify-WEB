import React, { useEffect, useState } from 'react';

import axios from 'axios';
import styles from './AdminPage.module.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://eventify-backend.azurewebsites.net/api/Profile/get-all');
        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://eventify-backend.azurewebsites.net/api/Profile/delete/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  const handleUpdate = async (updatedUser) => {
    try {
        console.log(updatedUser);
      await axios.post('https://eventify-backend.azurewebsites.net/api/Profile/update-profile', updatedUser);
      setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
      setShowUpdateModal(false);
      setSelectedUser(null);
    } catch (error) {
      setError('Failed to update user');
    }
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  return (
    <div className={styles.adminPage}>
      <h1>All Users</h1>
      {error && <p className={styles.error}>{error}</p>}
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Image</th>
            <th>Liked Events</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>
                {user.img ? <img src={user.img} alt={user.userName} className={styles.userImage} /> : 'No Image'}
              </td>
              <td>{user.likedEvents ? user.likedEvents.length : 'No Liked Events'}</td>
              <td>
                <button onClick={() => openUpdateModal(user)}>Update</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showUpdateModal && selectedUser && (
        <UpdateUserModal 
          user={selectedUser} 
          onClose={() => setShowUpdateModal(false)} 
          onSave={handleUpdate} 
        />
      )}
    </div>
  );
};

const UpdateUserModal = ({ user, onClose, onSave }) => {
  const [updatedUser, setUpdatedUser] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(updatedUser);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Update User</h2>
        <form onSubmit={handleSubmit}>
          <label>
            User Name
            <input 
              type="text" 
              name="userName" 
              value={updatedUser.userName} 
              onChange={handleChange} 
            />
          </label>
          <label>
            Email
            <input 
              type="email" 
              name="email" 
              value={updatedUser.email} 
              onChange={handleChange} 
            />
          </label>
          <label>
            Phone Number
            <input 
              type="text" 
              name="phoneNumber" 
              value={updatedUser.phoneNumber} 
              onChange={handleChange} 
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
