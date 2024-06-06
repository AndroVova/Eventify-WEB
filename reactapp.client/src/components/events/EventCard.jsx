import EventTypes from "../../models/EventTypes";
import LocationInfo from "./LocationInfo";
import React from "react";
import { useTranslation } from "react-i18next";

const EventCard = ({ event, onClick, styles }) => {
  const { t } = useTranslation();
  if (!event) return null;

  if (!event.locations || event.locations.length === 0) {
    event.locations = [{ pointX: 0, pointY: 0 }];
  }

  if (!event.tags || event.tags.length === 0) {
    event.tags = [{ id: "0", name: t("Default Tag"), color: "#ffffff" }];
  }
  

  const eventDate = new Date(event.date)
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

  return (
    <div className={styles.eventCard} onClick={() => onClick(event)}>
      <img
        src={`data:image/jpeg;base64,${event.img}`}
        alt={event.name}
        className={styles.eventImage}
      />
      <div className={styles.eventDetails}>
        <p className={styles.eventCategory}>
          {Object.keys(EventTypes).find(
            (key) => EventTypes[key] === event.type
          )}
        </p>
        <h2 className={styles.eventTitle}>{event.name}</h2>
        <p className={styles.eventDate}>{eventDate}</p>
        <div className={styles.eventLocation}>
          <LocationInfo
            lat={event.locations[0].pointY}
            lng={event.locations[0].pointX}
          />
        </div>
        <div className={styles.eventTags}>
          {event.tags.slice(0, 5).map((tag) => (
            <span
              key={tag.id}
              className={styles.tag}
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          ))}
          {event.tags.length > 5 && <span className={styles.tagMore}>...</span>}
        </div>
      </div>
    </div>
  );
};

export default EventCard;