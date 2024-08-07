import React from 'react';

function PaginationClassic({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <nav className="mb-4 sm:mb-0 sm:order-1" role="navigation" aria-label="Navigation">
        <ul className="flex justify-center">
          <li className="ml-3 first:ml-0">
            <button
              className={`btn ${currentPage === 1 ? 'bg-white border-slate-200 text-slate-300 cursor-not-allowed' : 'bg-white border-slate-200 hover:border-slate-300 text-indigo-500'}`}
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;- Previous
            </button>
          </li>
          <li className="ml-3 first:ml-0">
            <button
              className={`btn ${currentPage === totalPages ? 'bg-white border-slate-200 text-slate-300 cursor-not-allowed' : 'bg-white border-slate-200 hover:border-slate-300 text-indigo-500'}`}
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next -&gt;
            </button>
          </li>
        </ul>
      </nav>
      <div className="text-sm text-slate-500 text-center sm:text-left">
        Showing <span className="font-medium text-slate-600">{(currentPage - 1) * 10 + 1}</span> to <span className="font-medium text-slate-600">{Math.min(currentPage * 10, totalPages * 10)}</span> of <span className="font-medium text-slate-600">{totalPages * 10}</span> results
      </div>
    </div>
  );
}

export default PaginationClassic;