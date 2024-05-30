import React, { useEffect, useState } from "react";

import {AI_URL} from "../../clients/app.const"
import InputMessageBox from "./InputMessageBox";
import Message from "./Message";
import axios from "axios";
import styles from "./ChatBot.module.css";

const ChatBot = () => {
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
  
    useEffect(() => {
      const storedConversation = localStorage.getItem("conversation");
      if (storedConversation) {
        setConversation(JSON.parse(storedConversation));
      }
    }, []);
  
    const sendMessage = async () => {
      if (!message.trim()) return;
      const newMessage = { role: "user", content: message };
      const updatedConversation = [...conversation, newMessage];
      setConversation(updatedConversation);
      setMessage("");
      setIsTyping(true);
  
      try {
        const res = await axios.post(/*"http://localhost:8000/api/chatbot", {*/ `${AI_URL}/chatbot`, {
          message,
          history: updatedConversation,
        });
  
        const newBotMessage = { role: "bot", content: res.data.response };
  
        if (newBotMessage.content) {
          setTimeout(() => {
            const newConversation = [...updatedConversation, newBotMessage];
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
            <Message key={index} msg={msg} isLastBotMessage={index === conversation.length - 1 && msg.role === 'bot'} />
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
      <InputMessageBox message={message} setMessage={setMessage} sendMessage={sendMessage} />
    </div>
  );
};

export default ChatBot;
