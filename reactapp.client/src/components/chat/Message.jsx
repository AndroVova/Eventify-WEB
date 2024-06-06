import React, { useEffect, useState } from "react";

import { Typewriter } from "react-simple-typewriter";
import styles from "./ChatBot.module.css";
import { useTranslation } from "react-i18next";

const Message = ({ msg, isLastBotMessage }) => {
  const { t } = useTranslation();
  const [isTypewriterFinished, setIsTypewriterFinished] = useState(false);

  useEffect(() => {
    if (!isLastBotMessage) {
      setIsTypewriterFinished(true);
    }
  }, [isLastBotMessage]);

  return (
    <div className={`${styles.message} ${styles[msg.role]}`}>
      <strong>{msg.role === "user" ? t("User") : t("Bot")}:</strong>
      <div className={styles.userText}>
        {msg.role === "bot" ? (
          isTypewriterFinished ? (
            <span>{msg.content}</span>
          ) : (
            <Typewriter
              words={[msg.content]}
              typeSpeed={50}
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
    </div>
  );
};

export default Message;
