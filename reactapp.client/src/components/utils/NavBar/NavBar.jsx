import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { logout } from "../../../reducers/auth.reducer";
import styles from './nav.bar.module.css';
import { useTranslation } from "react-i18next";

const NavBar = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);

  const handleLogOut = () => {
    dispatch(logout());
  };

  return (
    <nav className={styles.navContainer}>
      <div className={styles.leftSide}>
        <Link to={'../map'} className={styles.logo}>Eventify</Link>
      </div>
      <div className={styles.centerLinks}>
        <Link className={styles.navLink} to={'../map'} replace={true}>{'map'}</Link>
        <Link className={styles.navLink} to={'../events'} replace={true}>{'events'}</Link>
        <Link className={styles.navLink} to={'../chat'} replace={true}>{'chat'}</Link>
        <Link className={styles.navLink} to={null} onClick={handleLogOut}>{t('log_out')}</Link>
      </div>
      <div className={styles.rightSide}>
        <Link className={styles.profileLink} to={'../profile'} replace={true}>
          <img src={user.image} alt="Profile" className={styles.profileImage} />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
