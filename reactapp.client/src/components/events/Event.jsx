import React, { useState } from "react";

import Map from "../map/Map";
import styles from "./Event.module.css";

const Event = ({ event, onClose, setEventsData }) => {
  const [likes, setLikes] = useState(event.likes);
  const [liked, setLiked] = useState(event.isLiked);

  const toggleLike = () => {
    const newLikes = likes + (liked ? -1 : 1);
    event.likes= newLikes;
    event.isLiked=!liked;
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
        <img src={event.image} alt={event.title} className={styles.modalImage} />
        <div className={styles.eventInfo}>
          <div>
            <h2>{event.title}</h2>
            <p className={styles.eventCategory}>{event.category}</p>
            <p>{event.date}</p>
            <p>{event.location}</p>
            <div className={styles.likesContainer} onClick={toggleLike}>
              <span className={styles.likesCount}>{likes}</span>
              <span className={liked ? styles.liked : styles.likeButton}>❤</span>
            </div>
          </div>
          <button className={styles.ticketButton}>Перейти к билету</button>
        </div>
      </div>
      <div className={styles.eventDescription}>
        {event.description.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className={styles.modalMap}>
        <Map
          center={event.position}
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
