import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import {SelectLang} from "../SelectLang/SelectLang";
import { SelectTheme } from '../SelectTheme/SelectTheme';
import { logout } from "../../../reducers/auth.reducer";
import styles from './nav.bar.module.css';
import { useTranslation } from "react-i18next";

const NavBar = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogOut = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navContainer}>
      <div className={styles.leftSide}>
        <Link to={'../map'} className={styles.logo}>Eventify</Link>
      </div>
      <div className={styles.centerLinks}>
        <Link className={styles.navLink} to={'../map'} replace={true}>{t('map')}</Link>
        <Link className={styles.navLink} to={'../events'} replace={true}>{t('events')}</Link>
        <Link className={styles.navLink} to={'../chat'} replace={true}>{t('chat')}</Link>
      </div>
      <div className={styles.rightSide}>
        <div className={styles.profileLink} onClick={handleMenuToggle}>
          <img src={user.image} alt="Profile" className={styles.profileImage} />
        </div>
        {isMenuOpen && (
          <div className={styles.dropdownMenu}>
            <Link className={styles.dropdownItem} to={'../profile'} replace={true} onClick={handleMenuToggle}>{t('profile')}</Link>
            <div className={styles.dropdownItem}>
              <SelectLang />
            </div>
            <div className={styles.dropdownItem}>
              <SelectTheme />
            </div>
            <div className={styles.dropdownItem} onClick={handleLogOut}>{t('log_out')}</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;