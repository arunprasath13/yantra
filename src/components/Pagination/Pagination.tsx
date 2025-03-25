// Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onRowsPerPageChange(Number(e.target.value));
    onPageChange(1); 
  };

  
  const renderPageButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-3 py-1 text-sm rounded ${
            currentPage === i ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'
          }`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  if (totalRows === 0) return null;

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center">
        <label className="mr-2 text-sm text-gray-600">No of rows per page</label>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="p-1 text-blue-500 hover:text-blue-700 disabled:text-gray-400"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {renderPageButtons()}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-1 text-blue-500 hover:text-blue-700 disabled:text-gray-400"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;