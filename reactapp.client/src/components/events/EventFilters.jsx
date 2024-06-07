import CustomSelect from "../utils/CustomSelect/CustomSelect";
import React from 'react';
import UserTypes from "../../models/UserTypes";
import { useTranslation } from "react-i18next";

const EventFilters = ({ 
  uniqueCategories, 
  uniqueTags, 
  selectedCategory, 
  selectedTag, 
  onCategoryChange, 
  onTagChange, 
  onSearchKeyDown,
  onSortByDate,
  sortOrder,
  styles,
  user,
  setShowAddEventModal,
  onTagSelect // Добавляем новую пропс
}) => {
  const { t } = useTranslation();
  const categoryOptions = uniqueCategories.map(category => ({
    value: category,
    label: category
  }));

  const tagOptions = uniqueTags.map(tag => ({
    value: tag,
    label: tag
  }));

  const handleCategoryChange = selectedOption => {
    onCategoryChange({
      target: {
        value: selectedOption ? selectedOption.value : ''
      }
    });
  };

  const handleTagChange = selectedOption => {
    const tagName = selectedOption ? selectedOption.value : '';
    onTagChange({
      target: {
        value: tagName
      }
    });
    if (onTagSelect) {
      onTagSelect(tagName);
    }
  };

  const selectedCategoryOption = categoryOptions.find(option => option.value === selectedCategory);
  const selectedTagOption = tagOptions.find(option => option.value === selectedTag);

  return (
    <div className={styles.controls}>
      <button className={styles.sortButton} onClick={onSortByDate}>
        {t("Sort by Date")} {sortOrder === "asc" ? "↑" : "↓"}
      </button>
      <div className={styles.filterGroup}>
        <label htmlFor="categorySelect" className={styles.filterLabel}>{t("Category")}:</label>
        <div className={styles.selectContainer}>
          <CustomSelect
            id="categorySelect"
            options={categoryOptions}
            value={selectedCategoryOption}
            onChange={handleCategoryChange}
          />
        </div>
      </div>
      <div className={styles.filterGroup}>
        <label htmlFor="tagSelect" className={styles.filterLabel}>{t("Tag")}:</label>
        <div className={styles.selectContainer}>
          <CustomSelect
            id="tagSelect"
            options={tagOptions}
            value={selectedTagOption}
            onChange={handleTagChange}
          />
        </div>
      </div>
      <input
        type="text"
        placeholder={t("Search by event title")}
        onKeyDown={onSearchKeyDown}
        className={styles.searchInput}
      />
      {user.role !== UserTypes.User && (
        <div className={styles.addEventContainer}>
          <button onClick={() => setShowAddEventModal(true)}>{t("Add Event")}</button>
        </div>
      )}
    </div>
  );
};

export default EventFilters;
