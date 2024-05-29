import React from "react";
import styles from "../../pages/ProfilePage.module.css";

const AvatarSection = ({ user, avatars, showAvatarOptions, handleAvatarClick, handleAvatarSelect }) => (
  <div className={styles.avatarSection}>
    <img
      src={user.image || avatars[0]}
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
);

export default AvatarSection;
