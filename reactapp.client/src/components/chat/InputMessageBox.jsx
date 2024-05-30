import React from "react";
import styles from "./ChatBot.module.css";

const InputMessageBox = ({ message, setMessage, sendMessage }) => {
  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        className={styles.inputBox}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className={styles.sendButton} onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default InputMessageBox;