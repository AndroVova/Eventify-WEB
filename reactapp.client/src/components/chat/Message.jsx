import React, { useEffect, useState } from "react";

import DraggableModal from "../layout/DraggableModal/DraggableModal";
import Event from "../events/Event";
import EventCard from "../events/EventCard";
import { Typewriter } from "react-simple-typewriter";
import styles from "./ChatBot.module.css";
import { useTranslation } from "react-i18next";

const Message = ({ msg, isLastBotMessage, onEventClick }) => {
  const { t } = useTranslation();
  const [isTypewriterFinished, setIsTypewriterFinished] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  useEffect(() => {
    if (!isLastBotMessage) {
      setIsTypewriterFinished(true);
    }
  }, [isLastBotMessage]);

  useEffect(() => {
    if (msg.role === "bot") {
      const jsonPattern = /\[.*\]/;
      const match = msg.content.match(jsonPattern);
  
      if (match) {
        try {
          const jsonString = match[0];
          const eventData = JSON.parse(jsonString);
          setEvents(eventData);
        } catch (error) {
          console.error("Ошибка при разборе JSON:", error);
        }
      }
    }
  }, [msg.content, msg.role]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className={`${styles.message} ${styles[msg.role]}`}>
      <strong>{msg.role === "user" ? t("User") : t("Bot")}:</strong>
      <div className={styles.userText}>
        {msg.role === "bot" && events.length > 0 ? (
          <div className={styles.eventList}>
            {events.map((event, index) => (
              <EventCard
                key={event.id || index}
                event={event}
                onClick={handleEventClick}
                styles={styles}
              />
            ))}
          </div>
        ) : msg.role === "bot" ? (
          isTypewriterFinished ? (
            <span>{msg.content}</span>
          ) : (
            <Typewriter
              words={[msg.content]}
              typeSpeed={20} 
              deleteSpeed={0}
              loop={1}
              cursor={false}
              onTypingEnd={() => setIsTypewriterFinished(true)}
            />
          )
        ) : (
          <span>{msg.content}</span>
        )}
      </div>
      {selectedEvent && (
        <DraggableModal
          isVisible={true}
          onClose={closeModal}
          headerText={t("Event Details")}
        >
          <Event
            event={selectedEvent}
            onClose={closeModal}
            setEventsData={setEvents}
          />
        </DraggableModal>
      )}
    </div>
  );
};

export default Message;
