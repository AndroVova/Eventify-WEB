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
}) => (
  <div className={styles.controls}>
    <button className={styles.sortButton} onClick={onSortByDate}>
      Sort by Date {sortOrder === "asc" ? "↑" : "↓"}
    </button>
    <div className={styles.filterGroup}>
      <label htmlFor="categorySelect" className={styles.filterLabel}>Category:</label>
      <select
        id="categorySelect"
        className={styles.filterButton}
        onChange={onCategoryChange}
        value={selectedCategory}
      >
        {uniqueCategories.map((category, index) => (
          <option key={index} value={category.split(' ')[0]}>{category}</option>
        ))}
      </select>
    </div>
    <div className={styles.filterGroup}>
      <label htmlFor="tagSelect" className={styles.filterLabel}>Tag:</label>
      <select
        id="tagSelect"
        className={styles.filterButton}
        onChange={onTagChange}
        value={selectedTag}
      >
        {uniqueTags.map((tag, index) => (
          <option key={index} value={tag.split(' ')[0]}>{tag}</option>
        ))}
      </select>
    </div>
    <input
      type="text"
      placeholder="Search by event title"
      onKeyDown={onSearchKeyDown}
      className={styles.searchInput}
    />
  </div>
);

export default EventFilters;
