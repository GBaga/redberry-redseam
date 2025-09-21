"use client";

import { useMemo } from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const pageNumbers = useMemo(() => {
    const pages = [];

    if (totalPages <= 5) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first 2, last 2, and current/adjacent
      const left = Math.max(currentPage - 1, 3);
      const right = Math.min(currentPage + 1, totalPages - 2);

      pages.push(1);
      pages.push(2);

      if (left > 3) pages.push("...");

      for (let i = left; i <= right; i++) {
        pages.push(i);
      }

      if (right < totalPages - 2) pages.push("...");

      pages.push(totalPages - 1);
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-8 h-8 rounded transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label="Previous page"
      >
        ◀
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, idx) => {
        if (page === "...") {
          return (
            <div
              key={`dots-${idx}`}
              className="flex items-center justify-center w-8 h-8 text-gray-500"
            >
              …
            </div>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`flex items-center justify-center w-8 h-8 text-sm font-medium rounded transition-all duration-200 ${
              isActive
                ? "bg-orange-500 text-white border border-orange-500 shadow-sm"
                : "text-gray-700 hover:bg-gray-100 border border-gray-200 bg-white"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-8 h-8 rounded transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label="Next page"
      >
        ▶
      </button>
    </div>
  );
}
