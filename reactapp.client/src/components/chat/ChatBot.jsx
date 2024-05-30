import React, { useEffect, useState } from "react";

import TypingText from "./TypingText";
import axios from "axios";
import styles from "./ChatBot.module.css";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const storedConversation = localStorage.getItem("conversation");
    if (storedConversation) {
      setConversation(JSON.parse(storedConversation));
    }
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return; // Не отправляем пустые сообщения
    const newMessage = { role: "user", content: message };
    const updatedConversation = [...conversation, newMessage];
    setConversation(updatedConversation);
    setMessage("");
    setIsTyping(true);
  
    try {
      const res = await axios.post("http://localhost:5000/api/chatbot", {
        message,
        history: updatedConversation,
      });
      
      const newBotMessage = { role: "bot", content: res.data.response };
  
      if (newBotMessage.content) {
        setTimeout(() => {
          const newConversation = [...updatedConversation, newBotMessage];
          setResponse(res.data.response);
          setConversation(newConversation);
          localStorage.setItem("conversation", JSON.stringify(newConversation));
          setIsTyping(false);
        }, 1000);
      } else {
        setIsTyping(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        {conversation.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.role]}`}>
            <strong>{msg.role === "user" ? "User" : "Bot"}:</strong>
            {msg.role === "bot" ? (
              <TypingText text={msg.content} />
            ) : (
              <span className={styles.userText}>{msg.content}</span>
            )}
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.message} ${styles.bot}`}>
            <strong>Bot:</strong>
            <div className={styles.typing}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
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
    </div>
  );
};

export default ChatBot;
