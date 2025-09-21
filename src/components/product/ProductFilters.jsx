"use client";

import { useState, useRef, useEffect } from "react";

export default function ProductFilters({
  sort,
  minPrice,
  maxPrice,
  onSortChange,
  onPriceChange,
  onApply,
}) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const filterButtonRef = useRef(null);
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });

  // Calculate position for price filter popup
  useEffect(() => {
    if (showPriceFilter && filterButtonRef.current) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      setFilterPosition({
        top: rect.bottom + 8, // 8px gap below button
        left: rect.left,
      });
    }
  }, [showPriceFilter]);

  const sortOptions = [
    { value: "-created_at", label: "New products first" },
    { value: "price", label: "Price, low to high" },
    { value: "-price", label: "Price, high to low" },
  ];

  return (
    <div className="flex items-center gap-4 relative">
      {/* Filter Button */}
      <button
        ref={filterButtonRef}
        onClick={() => {
          setShowPriceFilter(!showPriceFilter);
          setShowSortDropdown(false);
        }}
        className="flex items-center gap-2 px-3 py-1 hover:opacity-70 transition-opacity"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4.5H18M8.25 9H15.75M10.5 13.5H13.5"
            stroke="#0F172A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[#10151F] font-['Poppins'] text-base">
          Filter
        </span>
      </button>

      {/* Sort By Dropdown */}
      <div className="relative">
        <button
          onClick={() => {
            setShowSortDropdown(!showSortDropdown);
            setShowPriceFilter(false);
          }}
          className="flex items-center gap-1 px-3 py-1 hover:opacity-70 transition-opacity"
        >
          <span className="text-[#10151F] font-['Poppins'] text-base">
            Sort by
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transform transition-transform ${
              showSortDropdown ? "rotate-180" : ""
            }`}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.21967 7.21967C5.51256 6.92678 5.98744 6.92678 6.28033 7.21967L10 10.9393L13.7197 7.21967C14.0126 6.92678 14.4874 6.92678 14.7803 7.21967C15.0732 7.51256 15.0732 7.98744 14.7803 8.28033L10.5303 12.5303C10.2374 12.8232 9.76256 12.8232 9.46967 12.5303L5.21967 8.28033C4.92678 7.98744 4.92678 7.51256 5.21967 7.21967Z"
              fill="#10151F"
            />
          </svg>
        </button>

        {showSortDropdown && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E1DFE1] rounded-lg shadow-lg z-50 py-2">
            <div className="px-4 py-2 border-b border-[#E1DFE1]">
              <span className="text-[#10151F] font-['Poppins'] font-semibold text-base">
                Sort by
              </span>
            </div>
            <div className="py-1">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setShowSortDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <span
                    className={`font-['Poppins'] text-base ${
                      sort === option.value
                        ? "text-[#FF4000] font-medium"
                        : "text-[#10151F] font-normal"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price Filter Popup */}
      {showPriceFilter && (
        <div
          className="fixed bg-white border border-[#E1DFE1] rounded-lg shadow-lg z-50 p-4"
          style={{
            top: `${filterPosition.top}px`,
            left: `${filterPosition.left}px`,
            width: "320px",
          }}
        >
          <h3 className="text-[#10151F] font-['Poppins'] font-semibold text-base mb-4">
            Select price
          </h3>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-xs text-gray-600 font-['Poppins'] mb-1 block">
                From
              </label>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => onPriceChange("min", e.target.value)}
                className="w-full px-3 py-2 border border-[#E1DFE1] rounded-lg outline-none focus:border-[#FF4000] font-['Poppins'] text-sm"
              />
            </div>

            <div className="flex-1">
              <label className="text-xs text-gray-600 font-['Poppins'] mb-1 block">
                To
              </label>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => onPriceChange("max", e.target.value)}
                className="w-full px-3 py-2 border border-[#E1DFE1] rounded-lg outline-none focus:border-[#FF4000] font-['Poppins'] text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                onApply();
                setShowPriceFilter(false);
              }}
              className="px-6 py-2 bg-[#FF4000] text-white rounded-[10px] hover:bg-[#E63900] transition-colors font-['Poppins'] text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(showPriceFilter || showSortDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowPriceFilter(false);
            setShowSortDropdown(false);
          }}
        />
      )}
    </div>
  );
}
