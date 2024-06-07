import { useTranslation } from "react-i18next";

const DeleteConfirmModal = ({ user, onClose, onConfirm, styles }) => {
    const { t } = useTranslation();
  
    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2>{t("Confirm Deletion")}</h2>
          <p>{t("Are you sure you want to delete this user?")}</p>
          <p>
            {t("User Name")}: {user.userName}
          </p>
          <p>
            {t("Email")}: {user.email}
          </p>
          <p>
            {t("Role")}: {user.role}
          </p>
          <div className={styles.modalActions}>
            <button onClick={onConfirm}>{t("Delete")}</button>
            <button onClick={onClose}>{t("Cancel")}</button>
          </div>
        </div>
      </div>
    );
  };
export default DeleteConfirmModal;