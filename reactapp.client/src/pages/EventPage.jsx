import React, { useEffect, useState } from "react";

import DraggableModal from "../components/layout/DraggableModal/DraggableModal";
import Event from "../components/events/Event";
import styles from "./EventPage.module.css";

const EventPage = ({ eventsData, setEventsData }) => {
  const [events, setEvents] = useState(eventsData);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const categoryCounts = eventsData.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});

  const tagCounts = eventsData.reduce((acc, event) => {
    event.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const uniqueCategories = ["All"];
  for (let category in categoryCounts) {
    uniqueCategories.push(`${category} (${categoryCounts[category]})`);
  }

  const uniqueTags = ["All"];
  for (let tag in tagCounts) {
    uniqueTags.push(`${tag} (${tagCounts[tag]})`);
  }

  const handleSortByDate = () => {
    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setEvents(sortedEvents);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value.split(' ')[0];
    setSelectedCategory(selectedCategory);
  };

  const handleTagChange = (e) => {
    const selectedTag = e.target.value.split(' ')[0];
    setSelectedTag(selectedTag);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(e.target.value);
    }
  };

  useEffect(() => {
    let filteredEvents = eventsData;

    if (selectedCategory !== "All") {
      filteredEvents = filteredEvents.filter(event => event.category === selectedCategory);
    }

    if (selectedTag !== "All") {
      filteredEvents = filteredEvents.filter(event => event.tags.includes(selectedTag));
    }

    if (searchQuery) {
      filteredEvents = filteredEvents.filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    setEvents(filteredEvents);
    setCurrentPage(1);
  }, [selectedCategory, selectedTag, searchQuery, eventsData]);

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const paginatedEvents = events.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={styles.eventListContainer}>
      <div className={styles.controls}>
        <button className={styles.sortButton} onClick={handleSortByDate}>
          Sort by Date {sortOrder === "asc" ? "↑" : "↓"}
        </button>
        <div className={styles.filterGroup}>
          <label htmlFor="categorySelect" className={styles.filterLabel}>Category:</label>
          <select
            id="categorySelect"
            className={styles.filterButton}
            onChange={handleCategoryChange}
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
            onChange={handleTagChange}
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
          onKeyDown={handleSearchKeyDown}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.eventsList}>
        {paginatedEvents.length > 0 ? (
          paginatedEvents.map((event) => (
            <div key={event.id} className={styles.eventCard} onClick={() => handleEventClick(event)}>
              <img
                src={event.image}
                alt={event.title}
                className={styles.eventImage}
              />
              <div className={styles.eventDetails}>
                <p className={styles.eventCategory}>{event.category}</p>
                <h2 className={styles.eventTitle}>{event.title}</h2>
                <p className={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className={styles.eventLocation}>{event.location}</p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noEventsMessage}>No events found</p>
        )}
      </div>
  
      <div className={styles.paginationControls}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={currentPage * itemsPerPage >= events.length}>
          Next
        </button>
      </div>
  
      {selectedEvent && (
        <DraggableModal isVisible={true} onClose={closeModal} headerText="Event Details">
          <Event event={selectedEvent} onClose={closeModal} setEventsData={setEventsData} />
        </DraggableModal>
      )}
    </div>
  );
}

export default EventPage;
