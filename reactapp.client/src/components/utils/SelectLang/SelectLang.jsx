import React, { useState } from 'react';

import { LANG_KEY } from '../../../i18next';
import i18n from 'i18next';
import styles from './select.lang.module.css';

export const SelectLang = () => {
  const [lang, setLang] = useState(i18n.language);

  const handleToggle = async () => {
    const newLang = lang === 'en' ? 'ua' : 'en';
    setLang(newLang);
    await i18n.changeLanguage(newLang);
    localStorage.setItem(LANG_KEY, newLang);
  };

  return (
    <div className={styles.switchContainer}>
      <span className={styles.label}>EN</span>
      <label className={styles.switch}>
        <input type="checkbox" checked={lang === 'ua'} onChange={handleToggle} />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
      <span className={styles.label}>UA</span>
    </div>
  );
};
