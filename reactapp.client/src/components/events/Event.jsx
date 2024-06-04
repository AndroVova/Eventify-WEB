import React, { useState } from "react";

import EventTypes from "../../models/EventTypes";
import Map from "../map/Map";
import styles from "./Event.module.css";

const Event = ({ event, onClose, setEventsData }) => {
  const [likes, setLikes] = useState(event.likes);
  const [liked, setLiked] = useState(event.isLiked);
  const location = useState(event.locations[0]);
  const toggleLike = () => {
    const newLikes = likes + (liked ? -1 : 1);
    event.likes = newLikes;
    event.isLiked = !liked;
    setLikes(newLikes);
    setLiked(!liked);

    setEventsData(prevEvents => {
      const updatedEvents = prevEvents.map(ev =>
        ev.id === event.id ? event : ev
      );
      return updatedEvents;
    });
  };

  if (!event) return null;

  return (
    <div className={styles.modalContent}>
      <div className={styles.eventHeader}>
        <img src={`data:image/jpeg;base64,${event.img}`} alt={event.name} className={styles.modalImage} />
        <div className={styles.eventInfo}>
          <div>
            <h2>{event.name}</h2>
            <p className={styles.eventCategory}>
              {Object.keys(EventTypes).find(key => EventTypes[key] === event.type)}
            </p>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>{`Lat: ${location[0].pointY}, Lng: ${location[0].pointX}`}</p>
            <div className={styles.likesContainer} onClick={toggleLike}>
              <span className={styles.likesCount}>{likes}</span>
              <span className={liked ? styles.liked : styles.likeButton}>❤</span>
            </div>
          </div>
          <button className={styles.ticketButton} onClick={() => window.open(event.link, "_blank")}>
            Перейти к билету
          </button>
        </div>
      </div>
      <div className={styles.eventDescription}>
        {event.description.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className={styles.modalMap}>
        <Map
          center={{ lat: parseFloat(location.pointY), lng: parseFloat(location.pointX) }}
          markersData={[event]}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
          }}
          isModal={true}
        />
      </div>
    </div>
  );
};

export default Event;
