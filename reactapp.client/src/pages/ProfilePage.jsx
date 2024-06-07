import React, { useState } from "react";
import { changeProfile, updateUserImage } from "../reducers/auth.reducer";
import { useDispatch, useSelector } from "react-redux";

import AvatarSection from "../components/profile/AvatarSection";
import ImagesTypes from "../models/imagesTypes";
import LikedEvents from "../components/profile/LikedEvents";
import Preferences from "../components/profile/Preferences";
import UserDetails from "../components/profile/UserDetails";
import axios from "axios";
import styles from "./ProfilePage.module.css";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.userName || t("Default Name"));
  const [login, setLogin] = useState(user.email);
  const [phone, setPhone] = useState(user.phoneNumber || "");
  const [selectedCategories, setSelectedCategories] = useState(user.types || []);
  const [selectedAvatar, setSelectedAvatar] = useState(user.img ?? ImagesTypes.defaultAvatar);

  if (!user) return null;

  const handleAvatarClick = () => {
    setShowAvatarOptions(!showAvatarOptions);
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    dispatch(updateUserImage(avatar));
    setShowAvatarOptions(false);
  };

  const handleSave = async () => {
    const updatedProfile = { 
      userName: name, 
      email: login, 
      phoneNumber: phone, 
      img: selectedAvatar, 
      id: user.id 
    };
    
    try {
      await axios.post("https://eventify-backend.azurewebsites.net/api/Profile/update-profile", updatedProfile);
      dispatch(changeProfile(updatedProfile));
      setIsEditing(false);
    } catch (error) {
      console.error(t("Failed to update profile"), error);
    }
  };

  const handleAddCategory = (event) => {
    const newCategory = event.target.value;
    if (newCategory && !selectedCategories.includes(newCategory)) {
      setSelectedCategories([...selectedCategories, newCategory]);
    }
  };

  const handleRemoveCategory = (category) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== category));
  };

  const likedEvents = user.likedEvents;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.userInfo}>
        <UserDetails
          isEditing={isEditing}
          name={name}
          login={login}
          phone={phone}
          setName={setName}
          setLogin={setLogin}
          setPhone={setPhone}
          user={user}
        />
        <AvatarSection
          user={{ ...user, img: selectedAvatar }}
          showAvatarOptions={showAvatarOptions}
          handleAvatarClick={handleAvatarClick}
          handleAvatarSelect={handleAvatarSelect}
          isEditing={isEditing}
        />
      </div>
      <div className={styles.settings}>
        <Preferences
          isEditing={isEditing}
          selectedCategories={selectedCategories}
          handleAddCategory={handleAddCategory}
          handleRemoveCategory={handleRemoveCategory}
        />
        <LikedEvents events={likedEvents} />
      </div>
      {isEditing ? (
        <button className={styles.saveButton} onClick={handleSave}>
          {t("Save & Exit")}
        </button>
      ) : (
        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
          {t("Edit Profile")}
        </button>
      )}
    </div>
  );
};

export default ProfilePage;
