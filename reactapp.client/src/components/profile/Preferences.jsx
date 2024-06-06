import React from "react";
import styles from "../../pages/ProfilePage.module.css";
import { useTranslation } from "react-i18next";

const categories = [
  "art",
  "carnival",
  "technology",
  "concert",
  "music",
  "sport",
  "theater",
  "food",
];

const Preferences = ({ isEditing, selectedCategories, handleAddCategory, handleRemoveCategory }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.settingItem}>
      <span>{t("Preferences")}:</span>
      <div className={styles.preferencesContainer}>
        {selectedCategories.map(category => (
          <div key={category} className={styles.preferenceItem}>
            {category}
            {isEditing && (
              <button onClick={() => handleRemoveCategory(category)}>x</button>
            )}
          </div>
        ))}
      </div>
      {isEditing && (
        <div className={styles.addCategory}>
          <select className={styles.selectField} onChange={handleAddCategory} value="">
            <option value="" disabled>{t("Select Category")}</option>
            {categories.filter(cat => !selectedCategories.includes(cat)).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Preferences;
