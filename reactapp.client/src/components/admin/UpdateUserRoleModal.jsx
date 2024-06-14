import React, { useState } from "react";

import { useTranslation } from "react-i18next";

const UpdateUserRoleModal = ({
  user,
  onClose,
  onSave,
  roleReverseMap,
  styles,
}) => {
  const { t } = useTranslation();
  const [newRole, setNewRole] = useState(user.role);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user.id, Number(newRole));
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{t("Change User Role")}</h2>
        <form onSubmit={handleSubmit}>
        <label>
            {t("Role")}
            <select
              value={newRole}
              onChange={(e) => setNewRole(Number(e.target.value))} 
            >
              {Object.entries(roleReverseMap).map(([value, label]) => (
                <option key={value} value={value}> 
                  {label} 
                </option>
              ))}
            </select>
          </label>
          <button type="submit">{t("Save")}</button>
          <button type="button" onClick={onClose}>
            {t("Cancel")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserRoleModal;
