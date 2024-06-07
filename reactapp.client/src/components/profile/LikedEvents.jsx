import React, { useState } from "react";

import DraggableModal from "../layout/DraggableModal/DraggableModal";
import Event from "../events/Event";
import LocationInfo from "../events/LocationInfo";
import PaginationControls from "../events/PaginationControls";
import styles from "./LikedEvents.module.css";
import { useTranslation } from "react-i18next";

const LikedEvents = ({ events, setEventsData }) => {
  const { t } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const eventDate = (event) => new Date(event.date) //TODO: localization
    .toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "");

  const totalPages = Math.ceil(events.length / itemsPerPage);

  const currentEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className={styles.likedEventsContainer}>
      <h3>{t("Liked Events")}</h3>
      {currentEvents.length > 0 ? (
        currentEvents.map(event => (
          <div key={event.id} className={styles.eventCard} onClick={() => handleEventClick(event)}>
            <img src={`data:image/jpeg;base64,${event.img}`} alt={event.name} className={styles.eventImage} />
            <div className={styles.eventDetails}>
              <h4>{event.name}</h4>
              <p>{eventDate(event)}</p>
              <LocationInfo lat={event.locations[event.locations.length - 1].pointY} lng={event.locations[event.locations.length - 1].pointX}/>
            </div>
          </div>
        ))
      ) : (
        <p>{t("No liked events")}</p>
      )}
      {selectedEvent && (
        <DraggableModal isVisible={true} onClose={closeModal} headerText={t("Event Details")}>
          <Event event={selectedEvent} onClose={closeModal} setEventsData={setEventsData} />
        </DraggableModal>
      )}
      <PaginationControls 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onNextPage={handleNextPage} 
        onPrevPage={handlePrevPage} 
      />
    </div>
  );
};

export default LikedEvents;
