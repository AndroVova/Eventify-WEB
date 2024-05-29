import React, { useEffect, useState } from 'react';

import styles from './select.theme.module.css';

const THEME_KEY = 'THEME_KEY';

export const SelectTheme = () => {
  const storedTheme = localStorage.getItem(THEME_KEY) ?? 'light';
  const [theme, setTheme] = useState(storedTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className={styles.switchContainer}>
      <span className={styles.label}>{theme === 'light' ? 'light' : 'dark'}</span>
      <label className={styles.switch}>
        <input type="checkbox" checked={theme === 'dark'} onChange={handleToggle} />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
    </div>
  );
};
