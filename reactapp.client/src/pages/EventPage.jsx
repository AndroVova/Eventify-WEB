import React, { useCallback, useEffect, useState } from "react";

import AddEventForm from "../components/events/AddEventForm";
import DraggableModal from "../components/layout/DraggableModal/DraggableModal";
import Event from "../components/events/Event";
import EventCard from "../components/events/EventCard";
import EventFilters from "../components/events/EventFilters";
import EventTypes from "../models/EventTypes";
import Modal from "react-modal";
import PaginationControls from "../components/events/PaginationControls";
import axios from "axios";
import styles from "./EventPage.module.css";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const EventPage = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [eventsData, setEventsData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 9;
  const [totalPages, setTotalPages] = useState(1);
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

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    const postData = {
      searchText: searchQuery,
      page: currentPage,
      pageSize: itemsPerPage,
      sortBy: "date",
      sortAscending: sortOrder === "asc",
      types:
        selectedCategory !== "All"
          ? [EventTypes[selectedCategory]]
          : Object.values(EventTypes),
    };

    try {
      const response = await axios.post(
        "https://eventify-backend.azurewebsites.net/api/Event/get-events",
        postData
      );
      if (response.status !== 200) {
        throw new Error(t("Failed to fetch events"));
      }
      const data = response.data;
      setEventsData(data);

      const paginationHeader = response.headers["x-pagination"];
      if (paginationHeader) {
        const paginationData = JSON.parse(paginationHeader);
        const totalPages = paginationData.totalPages;
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.error(t("Error fetching events"), error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, currentPage, itemsPerPage, sortOrder, selectedCategory,t]);

  useEffect(() => {
    fetchEvents();
    fetchTags();
  }, [fetchEvents, fetchTags, t]);

  const uniqueCategories = ["All", ...Object.keys(EventTypes)];
  const uniqueTags = ["All", ...new Set(availableTags.map((tag) => tag.name))];

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
    if ( e.key === "Enter") {
      setSearchQuery(e.target.value);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
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
        user={user}
        setShowAddEventModal={setShowAddEventModal}
      />
      {showAddEventModal && (
        <Modal
          isOpen={showAddEventModal}
          onRequestClose={() => setShowAddEventModal(false)}
          contentLabel={t("Add New Event")}
          style={{
            content: {
              width: "50%",
              margin: "0 auto",
              borderRadius: "10px",
            },
          }}
        >
          <div className={styles.modalHeader}>{t("Add New Event")}</div>
          <AddEventForm
            onSubmit={handleAddEvent}
            className={styles.modalForm}
          />
          <button
            onClick={() => setShowAddEventModal(false)}
            className={styles.closeButton}
          >
            {t("Close")}
          </button>
        </Modal>
      )}
      <div className={styles.eventsList}>
        {isLoading ? (
          <div className={styles.loader}></div>
        ) : eventsData.length > 0 ? (
          eventsData.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={handleEventClick}
              styles={styles}
            />
          ))
        ) : (
          <p className={styles.noEventsMessage}>{t("No events found")}</p>
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
        <DraggableModal
          isVisible={true}
          onClose={closeModal}
          headerText={t("Event Details")}
        >
          <Event
            event={selectedEvent}
            onClose={closeModal}
            setEventsData={setEventsData}
          />
        </DraggableModal>
      )}
    </div>
  );
};
export default EventPage;
