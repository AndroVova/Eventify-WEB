import React from "react";
import styles from "./ChatBot.module.css";
import { useTranslation } from "react-i18next";

const InputMessageBox = ({ message, setMessage, sendMessage }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        className={styles.inputBox}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className={styles.sendButton} onClick={sendMessage}>
        {t("Send")}
      </button>
    </div>
  );
};

export default InputMessageBox;