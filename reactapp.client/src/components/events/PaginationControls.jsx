import React from 'react';
import styles from "./PaginationControls.module.css"
import { useTranslation } from "react-i18next";

const PaginationControls = ({ currentPage, totalPages, onNextPage, onPrevPage}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.paginationControls}>
      <button onClick={onPrevPage} disabled={currentPage === 1}>
        {t("Previous")}
      </button>
      <span>{t("Page")} {currentPage}</span>
      <button onClick={onNextPage} disabled={currentPage >= totalPages}>
        {t("Next")}
      </button>
    </div>
  );
};

export default PaginationControls;
