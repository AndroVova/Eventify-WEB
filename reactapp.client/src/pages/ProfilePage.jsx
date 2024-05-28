import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import avatar1 from "../resources/1.png";
import avatar2 from "../resources/2.png";
import avatar3 from "../resources/3.png";
import styles from "./ProfilePage.module.css";
import { updateUserImage } from "../reducers/auth.reducer";

const avatars = [avatar1, avatar2, avatar3];

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  if (!user) return null;

  const handleAvatarClick = () => {
    setShowAvatarOptions(!showAvatarOptions);
  };

  const handleAvatarSelect = (avatar) => {
    dispatch(updateUserImage(avatar));
    setShowAvatarOptions(false);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.userInfo}>
        <div className={styles.userDetails}>
          <p>Name: {user.name || "Default Name"}</p>
          <p>Login: {user.email}</p>
        </div>
        <div className={styles.avatarSection}>
          <img
            src={user.image || avatar1}
            alt="Profile"
            className={styles.profileImage}
            onClick={handleAvatarClick}
          />
          {showAvatarOptions && (
            <div className={styles.avatarOptions}>
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className={styles.avatarOption}
                  onClick={() => handleAvatarSelect(avatar)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.settings}>
        <div className={styles.settingItem}>
          <span>Preferences:</span>
          <button className={styles.preferenceButton}>Music</button>
        </div>
        <a href="https://www.google.com/" className={styles.likedEventsLink}>
          Liked Events
        </a>
      </div>
      <button className={styles.saveButton}>Save & Exit</button>
    </div>
  );
};

export default ProfilePage;
