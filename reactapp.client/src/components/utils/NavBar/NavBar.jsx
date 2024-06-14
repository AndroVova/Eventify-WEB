import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ImagesTypes from "../../../models/imagesTypes";
import { SelectLang } from "../SelectLang/SelectLang";
import { SelectTheme } from "../SelectTheme/SelectTheme";
import UserTypes from "../../../models/UserTypes";
import avatar1 from "../../../resources/1.png";
import avatar2 from "../../../resources/2.png";
import avatar3 from "../../../resources/3.png";
import defaultAvatar from "../../../resources/default.png";
import { logout } from "../../../reducers/auth.reducer";
import styles from "./nav.bar.module.css";
import { useTranslation } from "react-i18next";

const avatars = {
  [ImagesTypes.defaultAvatar]: defaultAvatar,
  [ImagesTypes.avatar1]: avatar1,
  [ImagesTypes.avatar2]: avatar2,
  [ImagesTypes.avatar3]: avatar3,
};

const NavBar = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEventsMenuOpen, setIsEventsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogOut = () => {
    dispatch(logout());
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsEventsMenuOpen(false);
    setIsAdminMenuOpen(false);
  };

  const handleEventsMenuToggle = () => {
    setIsEventsMenuOpen(!isEventsMenuOpen);
    setIsAdminMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleAdminMenuToggle = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
    setIsEventsMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleLinkCkick = () => {
    setIsAdminMenuOpen(false);
    setIsEventsMenuOpen(false);
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className={styles.navContainer}>
      <div className={styles.leftSide}>
        <Link to={"../map"} className={styles.logo}>
          Eventify
        </Link>
      </div>
      <div className={styles.centerLinks}>
        <Link
          className={`${styles.navLink} ${isActive("map") ? styles.active : ""}`}
          onClick={handleLinkCkick}
          to={"../map"}
          replace={true}
        >
          {t("map")}
        </Link>

        <div className={styles.navLinkContainer}>
          <div
            className={`${styles.navLink} ${isActive("events") ? styles.active : ""}`}
            onClick={handleEventsMenuToggle}
          >
            {t("events")}
          </div>
          {isEventsMenuOpen && (
            <div className={styles.dropdownMenu}>
              <Link
                className={styles.dropdownItem}
                to={"../events"}
                replace={true}
                onClick={handleEventsMenuToggle}
              >
                {t("all_events")}
              </Link>
              {user.role !== UserTypes.User && (
                <Link
                  className={styles.dropdownItem}
                  to={"../events/my"}
                  replace={true}
                  onClick={handleEventsMenuToggle}
                >
                  {t("my_events")}
                </Link>
              )}
            </div>
          )}
        </div>
        <Link
          className={`${styles.navLink} ${isActive("chat") ? styles.active : ""}`}
          onClick={handleLinkCkick}
          to={"../chat"}
          replace={true}
        >
          {t("chat")}
        </Link>
        {user.role === UserTypes.Admin && (
          <div className={styles.navLinkContainer}>
            <div
              className={`${styles.navLink} ${isActive("admin") ? styles.active : ""}`}
              onClick={handleAdminMenuToggle}
            >
              {t("admin")}
            </div>
            {isAdminMenuOpen && (
              <div className={`${styles.dropdownMenu} ${styles.adminDropdownMenu}`}>
                <Link
                  className={styles.dropdownItem}
                  to={"../admin/users"}
                  replace={true}
                  onClick={handleAdminMenuToggle}
                >
                  {t("admin_users")}
                </Link>
                <Link
                  className={styles.dropdownItem}
                  to={"../admin/tags"}
                  replace={true}
                  onClick={handleAdminMenuToggle}
                >
                  {t("admin_tags")}
                </Link>
                <Link
                  className={styles.dropdownItem}
                  to={"../admin/events"}
                  replace={true}
                  onClick={handleAdminMenuToggle}
                >
                  {t("admin_events")}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.rightSide}>
        <div className={styles.profileLink} onClick={handleMenuToggle}>
          <img
            src={avatars[user.img] || defaultAvatar}
            alt="Profile"
            className={styles.profileImage}
          />
        </div>
        {isMenuOpen && (
          <div className={styles.dropdownMenu}>
            <Link
              className={styles.dropdownItem}
              to={"../profile"}
              replace={true}
              onClick={handleMenuToggle}
            >
              {t("profile")}
            </Link>
            <div className={styles.dropdownItem}>
              <SelectLang />
            </div>
            {/* <div className={styles.dropdownItem}>
              <SelectTheme />
            </div> */}
            <div className={styles.dropdownItem} onClick={handleLogOut}>
              {t("log_out")}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
