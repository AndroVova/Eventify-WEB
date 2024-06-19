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
  onTagSelect,
  showAddEventModal
}) => {
  const { t } = useTranslation();
  const categoryOptions = uniqueCategories.map(category => {
    if (typeof category === 'string') {
      return { value: category, label: category };
    }
    return {
      value: category.value,
      label: t(`EventTypes.${category.value}`) || category.value
    };
  });

  const tagOptions = uniqueTags.map(tag => ({
    value: tag,
    label: tag
  }));

  const handleCategoryChange = selectedOption => {
    onCategoryChange({
      target: {
        value: selectedOption ? selectedOption.value : t("All")
      }
    });
  };
  
  const handleTagChange = selectedOption => {
    const tagName = selectedOption ? selectedOption.value : t("All");
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

  if (showAddEventModal) return null;

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
            isFilter={true}
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
            isFilter={true}
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
