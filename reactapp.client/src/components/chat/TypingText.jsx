import React, { useEffect, useState } from 'react';

import styles from './ChatBot.module.css'; // Подключаем CSS-модули

const TypingText = ({ text = "", typingSpeed = 50 }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText(''); // Сбрасываем состояние перед началом анимации

        if (!text) {
            return;
        }

        const typeText = async () => {
            for (let index = 0; index < text.length; index++) {
                await new Promise((resolve) => setTimeout(resolve, typingSpeed));
                setDisplayedText((prev) => prev + text[index]);
            }
        };

        typeText();

        return () => {
            setDisplayedText('');
        };
    }, [text, typingSpeed]);

    return <span className={styles.typingText}>{displayedText}</span>;
};

export default TypingText;
