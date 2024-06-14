import React from "react";
import styles from "./ChatBot.module.css";
import { useTranslation } from "react-i18next";

const InputMessageBox = ({ message, setMessage, sendMessage }) => {
  const { t } = useTranslation();

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        className={styles.inputBox}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className={styles.sendButton} onClick={sendMessage}>
        {t("Send")}
      </button>
    </div>
  );
};

export default InputMessageBox;