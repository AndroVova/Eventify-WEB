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
  const [selectedCategories, setSelectedCategories] = useState(user.tags || []);
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
  
    const tagsPayload = {
      userId: user.id,
      tags: selectedCategories.map((category) => ({
        id: category.id,
        name: category.name,
        color: category.color,
      })),
    };
    
    try {
      await axios.post(
        "https://eventify-backend.azurewebsites.net/api/Profile/update-profile",
        updatedProfile
      );
      dispatch(changeProfile(updatedProfile));
  
      await axios.post(
        "https://eventify-backend.azurewebsites.net/api/Profile/add-tags",
        tagsPayload
      );
  
      setIsEditing(false);
    } catch (error) {
      console.error(t("Failed to update profile or add tags"), error);
    }
  };

  const handleAddCategory = (selectedTag) => {
    if (selectedTag && !selectedCategories.some(tag => tag.id === selectedTag.id)) {
      setSelectedCategories([...selectedCategories, selectedTag]);
    }
  };

  const handleRemoveCategory = (tagId) => {
    setSelectedCategories(selectedCategories.filter(tag => tag.id !== tagId));
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
      {isEditing ? (
        <button className={styles.saveButton} onClick={handleSave}>
          {t("Save & Exit")}
        </button>
      ) : (
        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
          {t("Edit Profile")}
        </button>
      )}
      <div className={styles.settings}>
        <Preferences
          isEditing={isEditing}
          selectedCategories={selectedCategories}
          handleAddCategory={handleAddCategory}
          handleRemoveCategory={handleRemoveCategory}
        />
        <LikedEvents events={likedEvents} />
      </div>
      
    </div>
  );
};

export default ProfilePage;
