import EventTypes from "../../models/EventTypes";
import React from 'react';

const EventCard = ({ event, onClick, styles }) => {
  if (!event || !event.locations || event.locations.length === 0) {
    event.locations = [{ pointX: 0, pointY: 0 }]
  }

  const eventDate = new Date(event.date).toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(',', '');

  return (
    <div className={styles.eventCard} onClick={() => onClick(event)}>
      <img 
        src={`data:image/jpeg;base64,${event.img}`} 
        alt={event.name} 
        className={styles.eventImage} 
      />
      <div className={styles.eventDetails}>
        <p className={styles.eventCategory}>
          {Object.keys(EventTypes).find(key => EventTypes[key] === event.type)}
        </p>
        <h2 className={styles.eventTitle}>{event.name}</h2>
        <p className={styles.eventDate}>
          {eventDate}
        </p>
        <p className={styles.eventLocation}>
          {`Lat: ${event.locations[0].pointY}, Lng: ${event.locations[0].pointX}`}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
