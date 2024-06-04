import React, { useCallback, useEffect, useState } from "react";

import AddEventForm from "../components/events/AddEventForm";
import DraggableModal from "../components/layout/DraggableModal/DraggableModal";
import Event from "../components/events/Event";
import EventCard from "../components/events/EventCard";
import EventFilters from "../components/events/EventFilters";
import EventTypes from "../models/EventTypes";
import Modal from 'react-modal';
import PaginationControls from "../components/events/PaginationControls";
import axios from "axios";
import styles from "./EventPage.module.css";

const EventPage = () => {
  const [eventsData, setEventsData] = useState([]);
  const [events, setEvents] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // состояние загрузки
  const itemsPerPage = 9;
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true); // Начало загрузки
    const postData = {
      searchText: searchQuery,
      page: currentPage,
      pageSize: itemsPerPage,
      sortBy: "date",
      sortAscending: sortOrder === "asc",
      types: selectedCategory !== "All" ? [EventTypes[selectedCategory]] : Object.values(EventTypes)
    };

    try {
      const response = await axios.post("https://eventify-backend.azurewebsites.net/api/Event/get-events", postData);
      if (response.status !== 200) {
        throw new Error("Failed to fetch events");
      }
      const data = response.data;
      setEventsData(data);
      setEvents(data);

      const paginationHeader = response.headers['x-pagination'];
      if (paginationHeader) {
        const paginationData = JSON.parse(paginationHeader);
        const totalPages = paginationData.totalPages;
        setTotalPages(totalPages);
        setTotalPages(3);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false); // Конец загрузки
    }
  }, [searchQuery, currentPage, itemsPerPage, sortOrder, selectedCategory]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const uniqueCategories = ["All", ...Object.keys(EventTypes)];
  const uniqueTags = ["All", ...new Set(eventsData.flatMap(event => event.tags))];

  const handleSortByDate = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(e.target.value);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleAddEvent = (newEvent) => {
    setShowAddEventModal(false);
    fetchEvents();
  };

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
        <Modal
          isOpen={showAddEventModal}
          onRequestClose={() => setShowAddEventModal(false)}
          contentLabel="Add New Event"
        >
          <div className={styles.modalHeader}>Add New Event</div>
          <AddEventForm onSubmit={handleAddEvent} className={styles.modalForm} />
          <button onClick={() => setShowAddEventModal(false)} className={styles.closeButton}>Close</button>
        </Modal>
      )}
      <div className={styles.eventsList}>
        {isLoading ? (
          <div className={styles.loader}></div>
        ) : (
          events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event.id} event={event} onClick={handleEventClick} styles={styles} />
            ))
          ) : (
            <p className={styles.noEventsMessage}>No events found</p>
          )
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
};

export default EventPage;
