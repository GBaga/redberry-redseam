"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// Constants
const SORT_OPTIONS = [
  { value: "-created_at", label: "New products first" },
  { value: "created_at", label: "Old products first" },
  { value: "price", label: "Price, low to high" },
  { value: "-price", label: "Price, high to low" },
];

const POPUP_MARGIN = 16;
const POPUP_WIDTH = 320;

export default function ProductFilters({
  sort = "",
  minPrice = "",
  maxPrice = "",
  onSortChange,
  onPriceChange,
  onApply,
}) {
  console.log("ProductFilters props:", { sort, minPrice, maxPrice });

  // Combined state for better performance
  const [state, setState] = useState({
    showSortDropdown: false,
    showPriceFilter: false,
    localMinPrice: String(minPrice),
    localMaxPrice: String(maxPrice),
    filterPosition: { top: 0, left: 0 },
  });

  // Refs
  const filterButtonRef = useRef(null);
  const pricePopupRef = useRef(null);
  const sortDropdownRef = useRef(null);

  // Update state helper
  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Sync local price state with props when they change
  useEffect(() => {
    console.log("Syncing props to local state:", { minPrice, maxPrice });
    updateState({
      localMinPrice: String(minPrice || ""),
      localMaxPrice: String(maxPrice || ""),
    });
  }, [minPrice, maxPrice, updateState]);

  // Calculate popup position
  const calculatePopupPosition = useCallback(() => {
    if (!filterButtonRef.current) return;

    const rect = filterButtonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate horizontal position
    let left = rect.left - 220; // Offset to align better with button
    if (left + POPUP_WIDTH > viewportWidth - POPUP_MARGIN) {
      left = viewportWidth - POPUP_WIDTH - POPUP_MARGIN;
    }
    left = Math.max(POPUP_MARGIN, left);

    // Calculate vertical position
    let top = rect.bottom + 8;
    const popupHeight = 200; // Approximate height
    if (top + popupHeight > viewportHeight - POPUP_MARGIN) {
      top = rect.top - popupHeight - 8; // Show above if not enough space below
    }

    updateState({ filterPosition: { top, left } });
  }, [updateState]);

  // Update popup position when shown
  useEffect(() => {
    if (state.showPriceFilter) {
      calculatePopupPosition();
    }
  }, [state.showPriceFilter, calculatePopupPosition]);

  // Handle window events
  useEffect(() => {
    if (!state.showPriceFilter) return;

    const handleResize = () => calculatePopupPosition();
    const handleScroll = () => calculatePopupPosition();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [state.showPriceFilter, calculatePopupPosition]);

  // Close dropdowns on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        updateState({
          showSortDropdown: false,
          showPriceFilter: false,
        });
      }
    };

    if (state.showSortDropdown || state.showPriceFilter) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [state.showSortDropdown, state.showPriceFilter, updateState]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Handle price filter popup
      if (
        state.showPriceFilter &&
        pricePopupRef.current &&
        !pricePopupRef.current.contains(e.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(e.target)
      ) {
        console.log("Closing price filter (clicked outside)");
        updateState({ showPriceFilter: false });
      }

      // Handle sort dropdown
      if (
        state.showSortDropdown &&
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target)
      ) {
        console.log("Closing sort dropdown (clicked outside)");
        updateState({ showSortDropdown: false });
      }
    };

    if (state.showPriceFilter || state.showSortDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [state.showPriceFilter, state.showSortDropdown, updateState]);

  // Handle filter button click
  const handleFilterClick = useCallback(() => {
    console.log(
      "Filter button clicked, current showPriceFilter:",
      state.showPriceFilter
    );
    updateState({
      showPriceFilter: !state.showPriceFilter,
      showSortDropdown: false,
    });
  }, [state.showPriceFilter, updateState]);

  // Handle sort button click
  const handleSortClick = useCallback(() => {
    console.log(
      "Sort button clicked, current showSortDropdown:",
      state.showSortDropdown
    );
    updateState({
      showSortDropdown: !state.showSortDropdown,
      showPriceFilter: false,
    });
  }, [state.showSortDropdown, updateState]);

  // Handle sort selection
  const handleSortSelect = useCallback(
    (sortValue) => {
      console.log("Sort selected:", sortValue);
      if (onSortChange) {
        onSortChange(sortValue);
      }
      updateState({ showSortDropdown: false });
    },
    [onSortChange, updateState]
  );

  // Handle local price change
  const handleLocalPriceChange = useCallback(
    (field, value) => {
      console.log("Local price change:", field, value);
      // Allow empty string or positive numbers
      const processedValue =
        value === "" ? "" : String(Math.max(0, parseFloat(value) || 0));
      updateState({
        [field === "min" ? "localMinPrice" : "localMaxPrice"]: processedValue,
      });
    },
    [updateState]
  );

  // Validate price range
  const isPriceRangeValid = useMemo(() => {
    if (!state.localMinPrice || !state.localMaxPrice) return true;
    const min = parseFloat(state.localMinPrice);
    const max = parseFloat(state.localMaxPrice);
    return !isNaN(min) && !isNaN(max) && min <= max;
  }, [state.localMinPrice, state.localMaxPrice]);

  // Handle apply filters
  const handleApplyFilters = useCallback(() => {
    console.log("Applying filters:", {
      localMinPrice: state.localMinPrice,
      localMaxPrice: state.localMaxPrice,
      isPriceRangeValid,
    });

    if (!isPriceRangeValid) {
      alert("Minimum price cannot be greater than maximum price");
      return;
    }

    if (onPriceChange) {
      onPriceChange("min", state.localMinPrice);
      onPriceChange("max", state.localMaxPrice);
    }

    if (onApply) {
      onApply();
    }

    updateState({ showPriceFilter: false });
  }, [
    state.localMinPrice,
    state.localMaxPrice,
    isPriceRangeValid,
    onPriceChange,
    onApply,
    updateState,
  ]);

  // Handle clear filters
  const handleClearPriceFilters = useCallback(() => {
    console.log("Clearing price filters");
    updateState({
      localMinPrice: "",
      localMaxPrice: "",
    });

    if (onPriceChange) {
      onPriceChange("min", "");
      onPriceChange("max", "");
    }

    if (onApply) {
      onApply();
    }
  }, [onPriceChange, onApply, updateState]);

  // Check if filters are active
  const hasActiveFilters = Boolean(minPrice || maxPrice);
  const hasActiveSort = Boolean(sort);

  return (
    <div className="flex items-center gap-4 relative">
      {/* Filter Button */}
      <button
        ref={filterButtonRef}
        onClick={handleFilterClick}
        className={`flex items-center gap-2 px-3 py-1 hover:opacity-70 transition-opacity cursor-pointer ${
          hasActiveFilters ? "text-[#FF4000] font-medium" : ""
        }`}
        aria-expanded={state.showPriceFilter}
        aria-haspopup="true"
        aria-label="Filter by price"
      >
        <FilterIcon />
        Filter
        {hasActiveFilters && (
          <span className="ml-1 px-1.5 py-0.5 bg-[#FF4000] text-white text-xs rounded-full">
            {[minPrice, maxPrice].filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Sort Dropdown */}
      <div className="relative" ref={sortDropdownRef}>
        <button
          onClick={handleSortClick}
          className={`flex items-center gap-1 px-3 py-1 hover:opacity-70 transition-opacity cursor-pointer ${
            hasActiveSort ? "text-[#FF4000] font-medium" : ""
          }`}
          aria-expanded={state.showSortDropdown}
          aria-haspopup="true"
          aria-label="Sort products"
        >
          <SortIcon />
          Sort by
          <ChevronIcon className={state.showSortDropdown ? "rotate-180" : ""} />
        </button>

        {/* Sort Dropdown Menu */}
        {state.showSortDropdown && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-50 py-2">
            <button
              onClick={() => handleSortSelect("")}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer ${
                !sort ? "text-[#FF4000] font-medium bg-red-50" : ""
              }`}
            >
              Default
            </button>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer ${
                  sort === option.value
                    ? "text-[#FF4000] font-medium bg-red-50"
                    : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter Popup */}
      {state.showPriceFilter && (
        <PriceFilterPopup
          ref={pricePopupRef}
          position={state.filterPosition}
          localMinPrice={state.localMinPrice}
          localMaxPrice={state.localMaxPrice}
          isPriceRangeValid={isPriceRangeValid}
          onPriceChange={handleLocalPriceChange}
          onApply={handleApplyFilters}
          onClear={handleClearPriceFilters}
          onClose={() => {
            console.log("Closing price filter popup");
            updateState({ showPriceFilter: false });
          }}
        />
      )}
    </div>
  );
}

// Price Filter Popup Component
const PriceFilterPopup = React.forwardRef(
  (
    {
      position,
      localMinPrice,
      localMaxPrice,
      isPriceRangeValid,
      onPriceChange,
      onApply,
      onClear,
      onClose,
    },
    ref
  ) => (
    <div
      ref={ref}
      className="fixed bg-white border border-gray-300 rounded-lg shadow-xl z-50 p-4"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${POPUP_WIDTH}px`,
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Price Range</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 rounded hover:bg-gray-100"
          aria-label="Close price filter"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <PriceInput
          id="minPrice"
          label="Min Price"
          value={localMinPrice}
          onChange={(value) => onPriceChange("min", value)}
          placeholder="0"
          hasError={!isPriceRangeValid}
        />
        <PriceInput
          id="maxPrice"
          label="Max Price"
          value={localMaxPrice}
          onChange={(value) => onPriceChange("max", value)}
          placeholder="1000"
          hasError={!isPriceRangeValid}
        />
      </div>

      {!isPriceRangeValid && (
        <p className="text-red-500 text-xs mb-3">
          Min price must be less than max price
        </p>
      )}

      <div className="flex justify-between gap-3">
        <button
          onClick={onClear}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Clear
        </button>
        <button
          onClick={onApply}
          disabled={!isPriceRangeValid}
          className="px-6 py-2 bg-[#FF4000] text-white rounded-lg hover:bg-[#E63900] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Apply
        </button>
      </div>
    </div>
  )
);

PriceFilterPopup.displayName = "PriceFilterPopup";

// Price Input Component
const PriceInput = ({ id, label, value, onChange, placeholder, hasError }) => (
  <div className="flex-1">
    <label htmlFor={id} className="block text-sm text-gray-600 mb-1">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        $
      </span>
      <input
        id={id}
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-7 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4000] focus:border-transparent transition-colors ${
          hasError ? "border-red-500" : "border-gray-300"
        }`}
        min="0"
        step="0.01"
      />
    </div>
  </div>
);

// Icon Components
const FilterIcon = () => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
    <path
      d="M10.5 6.5L20.25 6.5M10.5 6.5C10.5 7.32843 9.82843 8 9 8C8.17157 8 7.5 7.32843 7.5 6.5M10.5 6.5C10.5 5.67157 9.82843 5 9 5C8.17157 5 7.5 5.67157 7.5 6.5M3.75 6.5H7.5M10.5 18.5H20.25M10.5 18.5C10.5 19.3284 9.82843 20 9 20C8.17157 20 7.5 19.3284 7.5 18.5M10.5 18.5C10.5 17.6716 9.82843 17 9 17C8.17157 17 7.5 17.6716 7.5 18.5M3.75 18.5L7.5 18.5M16.5 12.5L20.25 12.5M16.5 12.5C16.5 13.3284 15.8284 14 15 14C14.1716 14 13.5 13.3284 13.5 12.5M16.5 12.5C16.5 11.6716 15.8284 11 15 11C14.1716 11 13.5 11.6716 13.5 12.5M3.75 12.5H13.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SortIcon = () => (
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
);

const ChevronIcon = ({ className = "" }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-transform ${className}`}
  >
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

const CloseIcon = () => (
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
);
