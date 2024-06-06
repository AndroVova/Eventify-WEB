import React from "react";
import styles from "../../pages/ProfilePage.module.css";

const AvatarSection = ({ user, avatars, showAvatarOptions, handleAvatarClick, handleAvatarSelect, isEditing}) => {
  return (
    <div className={styles.avatarSection}>
      <img
        src={user.img}
        alt="User Avatar"
        className={styles.profileImage}
        onClick={handleAvatarClick}
      />
      {isEditing && showAvatarOptions && (
        <div className={styles.avatarOptions}>
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index}`}
              className={styles.avatarOption}
              onClick={() => handleAvatarSelect(avatar)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvatarSection;
