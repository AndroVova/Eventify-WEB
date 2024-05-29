import React from "react";
import styles from "../../pages/ProfilePage.module.css";

const UserDetails = ({ isEditing, name, login, phone, setName, setLogin, setPhone }) => (
  <div className={styles.userDetails}>
    {isEditing ? (
      <div>
        <label>
          Name:
          <input
            type="text"
            className={styles.inputField}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Login:
          <input
            type="text"
            className={styles.inputField}
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </label>
        <label>
          Phone:
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
        <p>Name: {name}</p>
        <p>Login: {login}</p>
        <p>Phone: {phone}</p>
      </div>
    )}
  </div>
);

export default UserDetails;