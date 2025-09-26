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
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  const filterButtonRef = useRef(null);
  const sortButtonRef = useRef(null);
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });

  // Update local state when props change
  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    if (showPriceFilter && filterButtonRef.current) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const popupWidth = 320;

      // Calculate position to keep popup in viewport
      let left = rect.left;
      if (left + popupWidth > viewportWidth) {
        left = viewportWidth - popupWidth - 16; // 16px margin
      }

      setFilterPosition({
        top: rect.bottom + 8,
        left: Math.max(16, left), // Minimum 16px from left edge
      });
    }
  }, [showPriceFilter]);

  const sortOptions = [
    { value: "-created_at", label: "New products first" },
    { value: "created_at", label: "Old products first" },
    { value: "price", label: "Price, low to high" },
    { value: "-price", label: "Price, high to low" },
  ];

  const handleLocalPriceChange = (field, value) => {
    if (field === "min") {
      setLocalMinPrice(value);
    } else {
      setLocalMaxPrice(value);
    }
  };

  const handleApplyFilters = () => {
    // Validate price range locally first
    if (
      localMinPrice &&
      localMaxPrice &&
      Number(localMinPrice) > Number(localMaxPrice)
    ) {
      alert("Minimum price cannot be greater than maximum price");
      return;
    }

    // Update parent component
    onPriceChange("min", localMinPrice);
    onPriceChange("max", localMaxPrice);
    onApply();
    setShowPriceFilter(false);
  };

  const handleSortSelect = (sortValue) => {
    onSortChange(sortValue);
    setShowSortDropdown(false);
  };

  const handleClearPriceFilters = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    onPriceChange("min", "");
    onPriceChange("max", "");
    onApply();
  };

  return (
    <div className="flex items-center gap-4 relative">
      {/* Filter Button */}
      <button
        ref={filterButtonRef}
        onClick={() => {
          setShowPriceFilter(!showPriceFilter);
          setShowSortDropdown(false);
        }}
        className={`flex items-center gap-2 px-3 py-1 hover:opacity-70 transition-opacity cursor-pointer ${
          minPrice || maxPrice ? "text-[#FF4000] font-medium" : ""
        }`}
        aria-expanded={showPriceFilter}
        aria-haspopup="true"
      >
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 6.5L20.25 6.5M10.5 6.5C10.5 7.32843 9.82843 8 9 8C8.17157 8 7.5 7.32843 7.5 6.5M10.5 6.5C10.5 5.67157 9.82843 5 9 5C8.17157 5 7.5 5.67157 7.5 6.5M3.75 6.5H7.5M10.5 18.5H20.25M10.5 18.5C10.5 19.3284 9.82843 20 9 20C8.17157 20 7.5 19.3284 7.5 18.5M10.5 18.5C10.5 17.6716 9.82843 17 9 17C8.17157 17 7.5 17.6716 7.5 18.5M3.75 18.5L7.5 18.5M16.5 12.5L20.25 12.5M16.5 12.5C16.5 13.3284 15.8284 14 15 14C14.1716 14 13.5 13.3284 13.5 12.5M16.5 12.5C16.5 11.6716 15.8284 11 15 11C14.1716 11 13.5 11.6716 13.5 12.5M3.75 12.5H13.5"
            stroke="#0F172A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Filter
      </button>

      {/* Sort Dropdown */}
      <div className="relative">
        <button
          ref={sortButtonRef}
          onClick={() => {
            setShowSortDropdown(!showSortDropdown);
            setShowPriceFilter(false);
          }}
          className={`flex items-center gap-1 px-3 py-1 hover:opacity-70 transition-opacity cursor-pointer ${
            sort ? "text-[#FF4000] font-medium" : ""
          }`}
          aria-expanded={showSortDropdown}
          aria-haspopup="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18M7 12h10m-7 6h4" />
          </svg>
          Sort by
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform ${
              showSortDropdown ? "rotate-180" : ""
            }`}
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </button>

        {showSortDropdown && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E1DFE1] rounded-lg shadow-lg z-50 py-2">
            <button
              onClick={() => handleSortSelect("")}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                !sort ? "text-[#FF4000] font-medium" : ""
              }`}
            >
              Default
            </button>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                  sort === option.value ? "text-[#FF4000] font-medium" : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter Popup */}
      {showPriceFilter && (
        <div
          className="fixed bg-white border border-[#E1DFE1] rounded-lg shadow-lg z-50 p-4"
          style={{
            top: `${filterPosition.top}px`,
            left: `${filterPosition.left - 220}px`,
            width: "320px",
            maxWidth: "calc(100vw - 32px)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Select price range</h3>
            <button
              onClick={() => setShowPriceFilter(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              aria-label="Close price filter"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label
                htmlFor="minPrice"
                className="block text-sm text-gray-600 mb-1"
              >
                Min Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  id="minPrice"
                  type="number"
                  placeholder="0"
                  value={localMinPrice}
                  onChange={(e) =>
                    handleLocalPriceChange("min", e.target.value)
                  }
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4000] focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor="maxPrice"
                className="block text-sm text-gray-600 mb-1"
              >
                Max Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  id="maxPrice"
                  type="number"
                  placeholder="1000"
                  value={localMaxPrice}
                  onChange={(e) =>
                    handleLocalPriceChange("max", e.target.value)
                  }
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4000] focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-3">
            <button
              onClick={handleClearPriceFilters}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-6 py-2 bg-[#FF4000] text-white rounded-lg hover:bg-[#E63900] transition-colors cursor-pointer"
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
