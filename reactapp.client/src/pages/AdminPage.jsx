import React, { useCallback, useEffect, useMemo, useState } from "react";
import { changeProfile, logout } from "../reducers/auth.reducer";
import { useDispatch, useSelector } from "react-redux";

import DeleteConfirmModal from "../components/admin/DeleteConfirmModal";
import UpdateUserModal from "../components/admin/UpdateUserModal";
import UpdateUserRoleModal from "../components/admin/UpdateUserRoleModal";
import axios from "axios";
import styles from "./AdminPage.module.css";
import { useTranslation } from "react-i18next";

const AdminPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRoleUpdateModal, setShowRoleUpdateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [error, setError] = useState("");

  const roleMap = {
    User: 0,
    Admin: 1,
    Employee: 2,
  };

  const roleReverseMap = useMemo(
    () => ({
      0: "User",
      1: "Admin",
      2: "Employee",
    }),
    []
  );

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://eventify-backend.azurewebsites.net/api/Profile/get-all"
      );
      const usersWithRoles = response.data.map((user) => ({
        ...user,
        role: roleReverseMap[user.role],
      }));
      setUsers(usersWithRoles);
    } catch (error) {
      setError(t("Failed to fetch users"));
    }
  }, [t, roleReverseMap]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://eventify-backend.azurewebsites.net/api/Profile/delete-profile?id=${userToDelete.id}`
      );
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setShowDeleteConfirm(false);
      if (userToDelete.id === currentUser.id) {
        dispatch(logout());
      }
    } catch (error) {
      setError(t("Failed to delete user"));
      setShowDeleteConfirm(false);
    }
  };

  const handleUpdate = async (updatedUser) => {
    try {
      await axios.post(
        "https://eventify-backend.azurewebsites.net/api/Profile/update-profile",
        { ...updatedUser, role: roleMap[updatedUser.role] }
      );
  
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setShowUpdateModal(false);
      setSelectedUser(null);
  
      if (updatedUser.id === currentUser.id) {
        dispatch(changeProfile(updatedUser));
      }
    } catch (error) {
      setError(t("Failed to update user"));
    }
  };
  

  const handleRoleUpdate = async (userId, newRole) => {
    const data = { role: newRole, userId };
    try {
      await axios.post(
        "https://eventify-backend.azurewebsites.net/api/Profile/update-role",
        data
      );
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: roleReverseMap[newRole] } : user
        )
      );
      setShowRoleUpdateModal(false);
      setSelectedUser(null);
    } catch (error) {
      setError(t("Failed to update user role"));
    }
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const openRoleUpdateModal = (user) => {
    setSelectedUser(user);
    setShowRoleUpdateModal(true);
  };

  const openDeleteConfirm = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
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
            <th>{t("Role")}</th>
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
              <td>{user.role}</td>
              <td>{user.img}</td>
              <td>
                {user.likedEvents
                  ? user.likedEvents.length
                  : t("No Liked Events")}
              </td>
              <td className={styles.actions}>
                <button onClick={() => openUpdateModal(user)}>
                  {t("Update")}
                </button>
                <button
                  className={styles.changeRole}
                  onClick={() => openRoleUpdateModal(user)}
                >
                  {t("Change Role")}
                </button>
                <button onClick={() => openDeleteConfirm(user)}>
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
          styles={styles}
        />
      )}
      {showRoleUpdateModal && selectedUser && (
        <UpdateUserRoleModal
          user={selectedUser}
          onClose={() => setShowRoleUpdateModal(false)}
          onSave={handleRoleUpdate}
          roleReverseMap={roleReverseMap}
          styles={styles}
        />
      )}

      {showDeleteConfirm && userToDelete && (
        <DeleteConfirmModal
          user={userToDelete}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          styles={styles}
        />
      )}
    </div>
  );
};

export default AdminPage;
