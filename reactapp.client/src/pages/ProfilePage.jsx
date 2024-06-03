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
import styles from "./ProfilePage.module.css";

const avatars = [avatar1, avatar2, avatar3];

const ProfilePage = ({ eventsData, setEventsData }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "Default Name");
  const [login, setLogin] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || "");
  const [selectedCategories, setSelectedCategories] = useState(user.categories || []);

  if (!user) return null;

  const handleAvatarClick = () => {
    setShowAvatarOptions(!showAvatarOptions);
  };

  const handleAvatarSelect = (avatar) => {
    dispatch(updateUserImage(avatar));
    setShowAvatarOptions(false);
  };

  const handleSave = () => {
    dispatch(changeProfile({ name, email: login, phone, categories: selectedCategories }));
    setIsEditing(false);
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

  const likedEvents = eventsData.filter(event => event.isLiked); // TODO: get reacted events request

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
        />
        <AvatarSection
          user={user}
          avatars={avatars}
          showAvatarOptions={showAvatarOptions}
          handleAvatarClick={handleAvatarClick}
          handleAvatarSelect={handleAvatarSelect}
        />
      </div>
      <div className={styles.settings}>
        <Preferences
          isEditing={isEditing}
          selectedCategories={selectedCategories}
          handleAddCategory={handleAddCategory}
          handleRemoveCategory={handleRemoveCategory}
        />
        <LikedEvents events={likedEvents} setEventsData={setEventsData} />
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
