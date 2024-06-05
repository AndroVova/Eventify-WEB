import CustomSelect from "../utils/CustomSelect/CustomSelect"
import React from 'react';

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
  styles
}) => {
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
    onTagChange({
      target: {
        value: selectedOption ? selectedOption.value : ''
      }
    });
  };

  const selectedCategoryOption = categoryOptions.find(option => option.value === selectedCategory);
  const selectedTagOption = tagOptions.find(option => option.value === selectedTag);

  return (
    <div className={styles.controls}>
      <button className={styles.sortButton} onClick={onSortByDate}>
        Sort by Date {sortOrder === "asc" ? "↑" : "↓"}
      </button>
      <div className={styles.filterGroup}>
        <label htmlFor="categorySelect" className={styles.filterLabel}>Category:</label>
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
        <label htmlFor="tagSelect" className={styles.filterLabel}>Tag:</label>
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
        placeholder="Search by event title"
        onKeyDown={onSearchKeyDown}
        className={styles.searchInput}
      />
    </div>
  );
};

export default EventFilters;
