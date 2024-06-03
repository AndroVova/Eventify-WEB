import React, { useEffect, useState } from "react";

import AddEventForm from "../components/events/AddEventForm";
import DraggableModal from "../components/layout/DraggableModal/DraggableModal";
import Event from "../components/events/Event";
import EventCard from "../components/events/EventCard";
import EventFilters from "../components/events/EventFilters";
import EventTypes from "../models/EventTypes";
import PaginationControls from "../components/events/PaginationControls";
import styles from "./EventPage.module.css";

const EventPage = ({ eventsData, setEventsData }) => {
  const [events, setEvents] = useState(eventsData);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const itemsPerPage = 9;

  const categoryCounts = eventsData.reduce((acc, event) => {
    const category = Object.keys(EventTypes).find(key => EventTypes[key] === event.type);
    acc[category] = (acc[category] || 0) + 1;
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
      filteredEvents = filteredEvents.filter(event => {
        const category = Object.keys(EventTypes).find(key => EventTypes[key] === event.type);
        return category === selectedCategory;
      });
    }

    if (selectedTag !== "All") {
      filteredEvents = filteredEvents.filter(event => event.tags.includes(selectedTag));
    }

    if (searchQuery) {
      filteredEvents = filteredEvents.filter(event => event.name.toLowerCase().includes(searchQuery.toLowerCase()));
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

  const handleAddEvent = (newEvent) => {
    setEventsData([...eventsData, newEvent]);
    setShowAddEventModal(false);
  };

  const paginatedEvents = events.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  return (
    <div className={styles.eventListContainer}>
      <EventFilters
        uniqueCategories={uniqueCategories}
        uniqueTags={uniqueTags}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        onCategoryChange={handleCategoryChange}
        onTagChange={handleTagChange}
        onSearchKeyDown={handleSearchKeyDown}
        onSortByDate={handleSortByDate}
        sortOrder={sortOrder}
        styles={styles}
      />
      <div className={styles.addEventContainer}>
        <button onClick={() => setShowAddEventModal(true)}>
          Add Event
        </button>
      </div>
      {showAddEventModal && (
        <DraggableModal isVisible={showAddEventModal} onClose={() => setShowAddEventModal(false)} headerText="Add New Event">
          <AddEventForm onSubmit={handleAddEvent} />
        </DraggableModal>
      )}
      <div className={styles.eventsList}>
        {paginatedEvents.length > 0 ? (
          paginatedEvents.map((event) => (
            <EventCard key={event.id} event={event} onClick={handleEventClick} styles={styles} />
          ))
        ) : (
          <p className={styles.noEventsMessage}>No events found</p>
        )}
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        styles={styles}
      />
      {selectedEvent && (
        <DraggableModal isVisible={true} onClose={closeModal} headerText="Event Details">
          <Event event={selectedEvent} onClose={closeModal} setEventsData={setEventsData} />
        </DraggableModal>
      )}
    </div>
  );
}

export default EventPage;
