import React from 'react';

const PaginationControls = ({ currentPage, totalPages, onNextPage, onPrevPage, styles}) => (
  <div className={styles.paginationControls}>
    <button onClick={onPrevPage} disabled={currentPage === 1}>
      Previous
    </button>
    <span>Page {currentPage}</span>
    <button onClick={onNextPage} disabled={currentPage >= totalPages}>
      Next
    </button>
  </div>
);

export default PaginationControls;
