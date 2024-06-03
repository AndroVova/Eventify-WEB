import { Link } from "react-router-dom";
import styles from './login.module.css';
import { useTranslation } from "react-i18next";

export const Login = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCircle2}></div>
      <div className={styles.loginCircle3}></div>
      <div className={styles.loginForm}>
        <div className={styles.loginLogo}>
        Eventify
        </div>
        <input className={styles.loginInput} type="text" name="email" placeholder={t('username')} />
        <input className={styles.loginInput} type="password" name="password" placeholder={t('password')} />
        <button className={styles.loginButton} type="submit">{t('login')}</button>
        <Link className={styles.loginLink} to="../support" replace={true}>{t('support')}</Link>
        <Link className={styles.loginLink} to="../registration" replace={true}>{t("sign_up")}</Link>
      </div>
    </div>
  );
}
