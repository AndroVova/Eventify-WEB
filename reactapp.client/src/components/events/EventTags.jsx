import React, { useCallback, useEffect, useState } from "react";

import CustomSelect from "../utils/CustomSelect/CustomSelect"; // Adjust the path as necessary
import { HexColorPicker } from "react-colorful";
import styles from "./EventTags.module.css";
import { useTranslation } from "react-i18next";

const EventTags = ({ isEditing, tags, onAddTag, onRemoveTag }) => {
  const { t } = useTranslation();
  const [availableTags, setAvailableTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#ffffff");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [error, setError] = useState("");

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch(
        "https://eventify-backend.azurewebsites.net/api/Tag/get-all"
      );
      const data = await response.json();
      setAvailableTags(data);
    } catch (error) {
      console.error(t("Error fetching tags"), error);
    }
  }, [t]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleAddTag = (selectedOption) => {
    const selectedTagId = selectedOption.value;
    const selectedTag = availableTags.find((tag) => tag.id === selectedTagId);
    if (selectedTag && !tags.some((tag) => tag.id === selectedTagId)) {
      onAddTag({
        id: selectedTag.id,
        name: selectedTag.name,
        color: selectedTag.color,
      });
    }
  };

  const handleCreateNewTag = async () => {
    if (!newTagName) {
      setError(t("Tag name is required"));
      return;
    }

    const newTag = { name: newTagName, color: newTagColor };

    try {
      const response = await fetch(
        "https://eventify-backend.azurewebsites.net/api/Tag/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTag),
        }
      );
      if (response.ok) {
        setNewTagName("");
        setNewTagColor("#ffffff");
        setError("");
        setShowColorPicker(false);
        await fetchTags();
      } else {
        setError(t("Failed to create new tag"));
      }
    } catch (error) {
      console.error(t("Error creating new tag"), error);
      setError(t("Failed to create new tag"));
    }
  };

  const handleRemoveTag = (tagId, e) => {
    e.stopPropagation(); // Останавливаем всплытие события
    onRemoveTag(tagId);
  };

  const availableTagOptions = availableTags
    .filter((tag) => !tags.some((t) => t.id === tag.id))
    .map((tag) => ({
      value: tag.id,
      label: tag.name,
    }));

  return (
    <div className={styles.settingItem}>
      <span>{t("Event Tags")}:</span>
      <div className={styles.preferencesContainer}>
        {tags.map((tag) => (
          <div
            key={tag.id}
            className={styles.preferenceItem}
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
            {isEditing && (
              <button onClick={(e) => handleRemoveTag(tag.id, e)}>x</button>
            )}
          </div>
        ))}
      </div>
      {isEditing && (
        <div className={styles.addCategory}>
          <CustomSelect
            id="tagSelect"
            options={availableTagOptions}
            value={null}
            onChange={handleAddTag}
            isClearable={true}
          />
        </div>
      )}
      <div className={styles.newTagContainer}>
        <h4>{t("Create New Tag")}</h4>
        <input
          type="text"
          placeholder={t("Tag Name")}
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
        <div className={styles.colorPickerContainer}>
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            {showColorPicker ? t("Close Color Picker") : t("Pick Color")}
          </button>
          <div
            className={styles.selectedColor}
            style={{ backgroundColor: newTagColor }}
          />
        </div>
        {showColorPicker && (
          <HexColorPicker color={newTagColor} onChange={setNewTagColor} />
        )}
        <button type="button" onClick={handleCreateNewTag}>
          {t("Create Tag")}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default EventTags;
