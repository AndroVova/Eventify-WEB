import { Link } from "react-router-dom";
import { SERVICE_URL } from "../../../clients/app.const";
import {fetchPost} from "../../../clients/response"
import styles from '../Login/login.module.css';
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Register = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: 0
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userName || !form.phoneNumber || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const config = {
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json"
      }
    };
    
    const response = await fetchPost(`${SERVICE_URL}/Auth/register`, null, config);

    if (response.isError) {
      setError(response.data.message || "Registration failed");
    } else {
      alert(response.data.message || "User created successfully!");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCircle2}></div>
      <div className={styles.registerCircle3}></div>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.loginLogo}>
          Eventify
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <input className={styles.loginInput} type="text" name="userName" placeholder={t('person_name')} value={form.userName} onChange={handleChange} />
        <input className={styles.loginInput} type="text" name="phoneNumber" placeholder={t('phone_number')} value={form.phoneNumber} onChange={handleChange} />
        <input className={styles.loginInput} type="email" name="email" placeholder={t('email')} value={form.email} onChange={handleChange} />
        <input className={styles.loginInput} type="password" name="password" placeholder={t('password')} value={form.password} onChange={handleChange} />
        <input className={styles.loginInput} type="password" name="confirmPassword" placeholder={t('confirm_password')} value={form.confirmPassword} onChange={handleChange} />
        {/* <select className={styles.loginInput} name="userType" value={form.userType} onChange={handleChange}>
          <option value={0}>{t('user')}</option>
          <option value={1}>{t('admin')}</option>
          <option value={2}>{t('employee')}</option>
        </select> */}
        <button className={styles.loginButton} type="submit">{t('register')}</button>
        <Link className={styles.loginLink} to="../login" replace={true}>{t('login')}</Link>
      </form>
    </div>
  );
}