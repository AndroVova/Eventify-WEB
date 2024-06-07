import React, { useState } from "react";

import { useTranslation } from "react-i18next";

const UpdateUserModal = ({ user, onClose, onSave, styles}) => {
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
export default UpdateUserModal;
