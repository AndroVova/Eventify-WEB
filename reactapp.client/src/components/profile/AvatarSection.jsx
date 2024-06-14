import ImagesTypes from "../../models/imagesTypes";
import React from "react";
import avatar1 from "../../resources/1.png";
import avatar2 from "../../resources/2.png";
import avatar3 from "../../resources/3.png";
import defaultAvatar from "../../resources/default.png";
import styles from "../../pages/ProfilePage.module.css";

const avatars = {
  [ImagesTypes.defaultAvatar]: defaultAvatar,
  [ImagesTypes.avatar1]: avatar1,
  [ImagesTypes.avatar2]: avatar2,
  [ImagesTypes.avatar3]: avatar3,
};

const AvatarSection = ({ user, showAvatarOptions, handleAvatarClick, handleAvatarSelect, isEditing }) => {
  return (
    <div className={styles.avatarSection}>
      <img
        src={avatars[user.img] || defaultAvatar}
        alt="User Avatar"
        className={styles.profileImage}
        onClick={handleAvatarClick}
      />
      {isEditing && showAvatarOptions && (
        <div className={styles.avatarOptions}>
          {Object.keys(avatars).map((key, index) => (
            <img
              key={index}
              src={avatars[key]}
              alt={`Avatar ${index}`}
              className={styles.avatarOption}
              onClick={() => handleAvatarSelect(parseInt(key, 10))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvatarSection;
