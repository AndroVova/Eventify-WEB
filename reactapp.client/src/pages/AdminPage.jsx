import React, { useCallback, useEffect, useState } from "react";

import axios from "axios";
import { changeProfile } from "../reducers/auth.reducer";
import styles from "./AdminPage.module.css";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const AdminPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://eventify-backend.azurewebsites.net/api/Profile/get-all"
      );
      setUsers(response.data);
    } catch (error) {
      setError(t("Failed to fetch users"));
    }
  }, [t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(
        `https://eventify-backend.azurewebsites.net/api/Profile/delete/${userId}`
      );
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      setError(t("Failed to delete user"));
    }
  };

  const handleUpdate = async (updatedUser) => {
    try {
      await axios.post(
        "https://eventify-backend.azurewebsites.net/api/Profile/update-profile",
        updatedUser
      );
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setShowUpdateModal(false);
      setSelectedUser(null);
      dispatch(changeProfile(updatedUser));
    } catch (error) {
      setError(t("Failed to update user"));
    }
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.adminPage}>
      <h2>{t("All Users")}</h2>
      <input
        type="text"
        placeholder={t("Search by user name")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />
      {error && <p className={styles.error}>{error}</p>}
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>{t("User Name")}</th>
            <th>{t("Email")}</th>
            <th>{t("Phone Number")}</th>
            <th>{t("Image")}</th>
            <th>{t("Liked Events")}</th>
            <th>{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>
                {user.img ? (
                  <img
                    src={user.img}
                    alt={user.userName}
                    className={styles.userImage}
                  />
                ) : (
                  t("No Image")
                )}
              </td>
              <td>
                {user.likedEvents
                  ? user.likedEvents.length
                  : t("No Liked Events")}
              </td>
              <td>
                <button onClick={() => openUpdateModal(user)}>
                  {t("Update")}
                </button>
                <button onClick={() => handleDelete(user.id)}>
                  {t("Delete")}
                </button>
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
  const { t } = useTranslation();
  const [updatedUser, setUpdatedUser] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({
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
        <h2>{t("Update User")}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            {t("User Name")}
            <input
              type="text"
              name="userName"
              value={updatedUser.userName}
              onChange={handleChange}
            />
          </label>
          <label>
            {t("Email")}
            <input
              type="email"
              name="email"
              value={updatedUser.email}
              onChange={handleChange}
            />
          </label>
          <label>
            {t("Phone Number")}
            <input
              type="text"
              name="phoneNumber"
              value={updatedUser.phoneNumber}
              onChange={handleChange}
            />
          </label>
          <button type="submit">{t("Save")}</button>
          <button type="button" onClick={onClose}>
            {t("Cancel")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
