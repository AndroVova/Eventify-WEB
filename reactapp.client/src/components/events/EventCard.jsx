import EventTypes from "../../models/EventTypes";
import React from 'react';

const EventCard = ({ event, onClick, styles }) => (
  <div className={styles.eventCard} onClick={() => onClick(event)}>
    <img src={event.img} alt={event.name} className={styles.eventImage} />
    <div className={styles.eventDetails}>
      <p className={styles.eventCategory}>
        {Object.keys(EventTypes).find(key => EventTypes[key] === event.type)}
      </p>
      <h2 className={styles.eventTitle}>{event.name}</h2>
      <p className={styles.eventDate}>
        {new Date(event.date).toLocaleDateString()}
      </p>
      <p className={styles.eventLocation}>
        {`Lat: ${event.locations.pointY}, Lng: ${event.locations.pointX}`}
      </p>
    </div>
  </div>
);

export default EventCard;
