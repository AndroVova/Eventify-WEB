import React, { useState } from "react";

import EventTypes from "../../models/EventTypes";
import LocationInfo from "./LocationInfo";
import Map from "../map/Map";
import axios from "axios";
import styles from "./Event.module.css";
import { useSelector } from "react-redux";

const Event = ({ event, setEventsData }) => {
  const user = useSelector((state) => state.auth.user);
  const [liked, setLiked] = useState(event.isLiked);
  const [disliked, setDisliked] = useState(event.isDisliked); // Initialize dislike state
  const location = event.locations[0];

  const endpoints = {
    post: {
      method: "POST",
      url: "https://eventify-backend.azurewebsites.net/api/Reaction/add-reaction",
    },
    update: {
      method: "POST",
      url: "https://eventify-backend.azurewebsites.net/api/Reaction/update-reaction",
    },
    delete: {
      method: "DELETE",
      url: "https://eventify-backend.azurewebsites.net/api/Reaction/delete-reaction",
    },
  };

  const handleReaction = async (reaction, action) => {
    const endpoint = endpoints[action];

    try {
      const response = await axios({
        method: endpoint.method,
        url: endpoint.url,
        data: {
          eventId: event.id,
          userID: user.id,
          reaction: reaction,
        },
      });
      if (response.data["isSuccess"]) {
        console.log(response.data.message);
      } else {
        console.error("Error: ", response.data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const toggleLike = async () => {
    if (liked) {
      await handleReaction(0, "delete");
    } else {
      if (disliked) {
        await handleReaction(0, "update");
        setDisliked(false);
      } else {
        await handleReaction(0, "post");
      }
    }
    setLiked(!liked);

    setEventsData((prevEvents) => {
      const updatedEvents = prevEvents.map((ev) =>
        ev.id === event.id
          ? { ...event, isLiked: !liked, isDisliked: false }
          : ev
      );
      return updatedEvents;
    });
  };

  const toggleDislike = async () => {
    if (disliked) {
      await handleReaction(1, "delete");
    } else {
      if (liked) {
        await handleReaction(1, "update");
        setLiked(false);
      } else {
        await handleReaction(1, "post");
      }
    }
    setDisliked(!disliked);

    setEventsData((prevEvents) => {
      const updatedEvents = prevEvents.map((ev) =>
        ev.id === event.id
          ? { ...event, isDisliked: !disliked, isLiked: false }
          : ev
      );
      return updatedEvents;
    });
  };

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

  if (!event) return null;

  return (
    <div className={styles.modalContent}>
      <div className={styles.eventHeader}>
        <img
          src={`data:image/jpeg;base64,${event.img}`}
          alt={event.name}
          className={styles.modalImage}
        />
        <div className={styles.eventInfo}>
          <div>
            <h2>{event.name}</h2>
            <p className={styles.eventCategory}>
              {Object.keys(EventTypes).find(
                (key) => EventTypes[key] === event.type
              )}
            </p>
            <p>{eventDate}</p>
            <LocationInfo lat={location.pointY} lng={location.pointX} />
            {event.tags && event.tags.length > 0 && (
              <div className={styles.tagsContainer}>
                {event.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className={styles.tag}
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            <div className={styles.reactionsContainer}>
              <div className={styles.likeButton} onClick={toggleLike}>
                <span className={liked ? styles.liked : styles.unliked}>❤</span>
              </div>
              <div className={styles.dislikeButton} onClick={toggleDislike}>
                <span
                  className={disliked ? styles.disliked : styles.undisliked}
                >
                  ✖
                </span>
              </div>
            </div>
          </div>
          <button
            className={styles.ticketButton}
            onClick={() => window.open(event.link, "_blank")}
          >
            Перейти к билету
          </button>
        </div>
      </div>
      <div className={styles.eventDescription}>
        {event.description.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className={styles.modalMap}>
        <Map
          center={{ lat: location.pointY, lng: location.pointX }}
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
