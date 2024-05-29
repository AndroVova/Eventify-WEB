import React, { useState } from "react";

import DraggableModal from "../layout/DraggableModal/DraggableModal";
import Event from "../events/Event";
import styles from "./LikedEvents.module.css";

const LikedEvents = ({ events, setEventsData }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className={styles.likedEventsContainer}>
      <h3>Liked Events</h3>
      {events.length > 0 ? (
        events.map(event => (
          <div key={event.id} className={styles.eventCard} onClick={() => handleEventClick(event)}>
            <img src={event.image} alt={event.title} className={styles.eventImage} />
            <div className={styles.eventDetails}>
              <h4>{event.title}</h4>
              <p>{event.date} at {event.location}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No liked events</p>
      )}
      {selectedEvent && (
        <DraggableModal isVisible={true} onClose={closeModal} headerText="Event Details">
          <Event event={selectedEvent} onClose={closeModal} setEventsData={setEventsData} />
        </DraggableModal>
      )}
    </div>
  );
};

export default LikedEvents;
