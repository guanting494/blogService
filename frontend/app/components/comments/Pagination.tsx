import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex justify-center mt-6" aria-label="Pagination">
      <ul className="flex items-center -space-x-px h-8 text-sm">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight rounded-s-lg 
              ${currentPage === 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'} 
              border border-gray-300`}
          >
            <span className="sr-only">Previous</span>
            <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
            </svg>
          </button>
        </li>

        {pages.map(page => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              className={`flex items-center justify-center px-3 h-8 leading-tight
                ${currentPage === page
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                  : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'}
                border border-gray-300`}
            >
              {page}
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center px-3 h-8 leading-tight rounded-e-lg
              ${currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'}
              border border-gray-300`}
          >
            <span className="sr-only">Next</span>
            <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}
