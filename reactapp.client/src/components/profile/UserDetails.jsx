import React from "react";
import styles from "../../pages/ProfilePage.module.css";
import { useTranslation } from "react-i18next";

const UserDetails = ({ isEditing, name, login, phone, setName, setLogin, setPhone, user }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.userDetails}>
      {isEditing ? (
        <div>
          <label>
            {t("Name")}:
            <input
              type="text"
              className={styles.inputField}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            {t("Login")}:
            <input
              type="text"
              className={styles.inputField}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </label>
          <label>
            {t("Phone")}:
            <input
              type="text"
              className={styles.inputField}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
        </div>
      ) : (
        <div>
          <p>{t("Name")}: {name}</p>
          <p>{t("Login")}: {login}</p>
          <p>{t("Phone")}: {phone}</p>
          <p>{t("Role")}: {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
