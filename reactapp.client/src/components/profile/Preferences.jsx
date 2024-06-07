import React, { useCallback, useEffect, useState } from "react";

import CustomSelect from "../utils/CustomSelect/CustomSelect";
import styles from "../../pages/ProfilePage.module.css";
import { useTranslation } from "react-i18next";

const Preferences = ({
  isEditing,
  selectedCategories,
  handleAddCategory,
  handleRemoveCategory
}) => {
  const { t } = useTranslation();
  const [availableTags, setAvailableTags] = useState([]);

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

  const availableTagOptions = availableTags
    .filter((tag) => !selectedCategories.some((t) => t.id === tag.id))
    .map((tag) => ({
      value: tag.id,
      label: tag.name,
      ...tag,
    }));

  return (
    <div className={styles.settingItem}>
      <span>{t("Preferences")}:</span>
      <div className={styles.preferencesContainer}>
        {selectedCategories.map((tag) => (
          <div
            key={tag.id}
            className={styles.preferenceItem}
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
            {isEditing && (
              <button onClick={() => handleRemoveCategory(tag.id)}>x</button>
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
            onChange={handleAddCategory}
            isClearable={true}
            placeholder={t("Select Tag")}
          />
        </div>
      )}
    </div>
  );
};

export default Preferences;
