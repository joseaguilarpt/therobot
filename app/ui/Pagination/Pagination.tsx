import React from 'react';
import './Pagination.scss';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (currentPage <= 2) {
      startPage = 1;
      endPage = Math.min(totalPages, 5);
    } else if (currentPage >= totalPages - 1) {
      startPage = Math.max(1, totalPages - 4);
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (startPage > 1) {
      pageNumbers.unshift('...');
    }
    if (endPage < totalPages) {
      pageNumbers.push('...');
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <ul className="pagination">
      {getPageNumbers().map((pageNumber, index) => (
        <li
          key={index}
          className={`pagination__item ${pageNumber === currentPage ? 'pagination__item--active' : ''}`}
          onClick={() => (typeof pageNumber === 'number' ? handlePageChange(pageNumber) : null)}
        >
          {pageNumber}
        </li>
      ))}
    </ul>
  );
};

export default Pagination;
