import React, { useEffect, useState } from "react";

import { ChromePicker } from "react-color";
import styles from './EventTags.module.css'

const EventTags = ({ tags, onAddTag, onRemoveTag}) => {
  const [availableTags, setAvailableTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#ffffff");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          "https://eventify-backend.azurewebsites.net/api/Tag/get-all"
        );
        const data = await response.json();
        setAvailableTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleAddTag = (e) => {
    const selectedTagId = e.target.value;
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
      setError("Tag name is required");
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
        const createdTag = await response.json();
        setAvailableTags((prev) => [...prev, createdTag]);
        onAddTag(createdTag);
        setNewTagName("");
        setNewTagColor("#ffffff");
        setError("");
        setShowColorPicker(false); // Скрываем палитру после создания тега
      } else {
        setError("Failed to create new tag");
      }
    } catch (error) {
      console.error("Error creating new tag:", error);
      setError("Failed to create new tag");
    }
  };

  return (
    <div className={styles.tagContainer}>
      <label>
        Event Tags
        <div className={styles.preferencesContainer}>
          {tags.map((tag) => (
            <div key={tag.id} className={styles.preferenceItem}>
              {tag.name}
              <button type="button" onClick={() => onRemoveTag(tag.id)}>
                x
              </button>
            </div>
          ))}
        </div>
        <select className={styles.selectField} onChange={handleAddTag} value="">
          <option value="" disabled>
            Select Tag
          </option>
          {availableTags
            .filter((tag) => !tags.some((t) => t.id === tag.id))
            .map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
        </select>
      </label>

      <div className={styles.newTagContainer}>
        <h4>Create New Tag</h4>
        <input
          type="text"
          placeholder="Tag Name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
        <button type="button" onClick={() => setShowColorPicker(!showColorPicker)}>
          {showColorPicker ? "Close Color Picker" : "Pick Color"}
        </button>
        {showColorPicker && (
          <ChromePicker
            color={newTagColor}
            onChangeComplete={(color) => setNewTagColor(color.hex)}
          />
        )}
        <button type="button" onClick={handleCreateNewTag}>
          Create Tag
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default EventTags;
