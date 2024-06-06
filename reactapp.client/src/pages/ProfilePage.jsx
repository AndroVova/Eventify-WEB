import React, { useState } from "react";
import { changeProfile, updateUserImage } from "../reducers/auth.reducer";
import { useDispatch, useSelector } from "react-redux";

import AvatarSection from "../components/profile/AvatarSection";
import LikedEvents from "../components/profile/LikedEvents";
import Preferences from "../components/profile/Preferences";
import UserDetails from "../components/profile/UserDetails";
import avatar1 from "../resources/1.png";
import avatar2 from "../resources/2.png";
import avatar3 from "../resources/3.png";
import axios from "axios";
import defaultAvatar from "../resources/default.png";
import styles from "./ProfilePage.module.css";

const avatars = [defaultAvatar, avatar1, avatar2, avatar3];

const ProfilePage = ({ eventsData, setEventsData }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.userName || "Default Name");
  const [login, setLogin] = useState(user.email);
  const [phone, setPhone] = useState(user.phoneNumber || "");
  const [selectedCategories, setSelectedCategories] = useState(user.types || []);
  const [selectedAvatar, setSelectedAvatar] = useState(user.img || defaultAvatar);

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
      console.error("Failed to update profile", error);
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
          avatars={avatars}
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
          Save & Exit
        </button>
      ) : (
        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default ProfilePage;
