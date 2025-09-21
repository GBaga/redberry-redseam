"use client";

import { useEffect, useState, useCallback } from "react";
import ProductFilters from "@/components/product/ProductFilters";
import ProductCard from "@/components/product/ProductCard";
import Pagination from "@/components/product/Pagination";
import { fetchProducts } from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(12); // Default value

  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert price strings to numbers, but keep empty strings as undefined
      const minPriceNum =
        minPrice && !isNaN(minPrice) ? Number(minPrice) : undefined;
      const maxPriceNum =
        maxPrice && !isNaN(maxPrice) ? Number(maxPrice) : undefined;

      console.log("Fetching products with params:", {
        page,
        sort,
        minPriceNum,
        maxPriceNum,
      });

      const data = await fetchProducts(page, sort, minPriceNum, maxPriceNum);

      console.log("API Response:", data);

      setProducts(data.data || []);
      setTotalPages(data.meta?.last_page || 1);
      setTotalResults(data.meta?.total || 0);

      // Set products per page based on API response
      if (data.meta?.per_page) {
        setProductsPerPage(data.meta.per_page);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
      setProducts([]);
      setTotalPages(1);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [page, sort, minPrice, maxPrice]);

  // Fetch products whenever dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSortChange = (newSort) => {
    console.log("Sort changed to:", newSort);
    setSort(newSort);
    setPage(1); // Reset to first page when sorting changes
  };

  const handlePriceChange = (field, value) => {
    // Allow empty strings and valid numbers
    if (value === "" || (/^\d*\.?\d*$/.test(value) && Number(value) >= 0)) {
      console.log(`Price ${field} changed to:`, value);
      if (field === "min") {
        setMinPrice(value);
      } else {
        setMaxPrice(value);
      }
    }
  };

  const handleApplyFilters = () => {
    // Validate price range
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      setError("Minimum price cannot be greater than maximum price");
      return;
    }

    console.log("Applying filters:", { minPrice, maxPrice });
    setError(null);
    setPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    console.log("Clearing all filters");
    setSort("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
    setError(null);
  };

  const handleRemoveFilter = (filter) => {
    console.log("Removing filter:", filter);
    if (filter === "sort") setSort("");
    if (filter === "minPrice") setMinPrice("");
    if (filter === "maxPrice") setMaxPrice("");
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    console.log("Page changed to:", newPage);
    setPage(newPage);
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  // Calculate result range for display
  const startResult =
    products.length > 0 ? (page - 1) * productsPerPage + 1 : 0;
  const endResult = Math.min(startResult + products.length - 1, totalResults);

  return (
    <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <h1 className="text-[42px] leading-[63px] font-semibold text-[#10151F] font-['Poppins']">
          Products
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {totalResults > 0 && !loading && (
            <span className="text-[12px] leading-[18px] text-[#3E424A] font-['Poppins'] whitespace-nowrap">
              Showing {startResult}–{endResult} of {totalResults} results
            </span>
          )}
          <ProductFilters
            sort={sort}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onSortChange={handleSortChange}
            onPriceChange={handlePriceChange}
            onApply={handleApplyFilters}
          />
        </div>
      </div>

      {/* Active Filters Pills */}
      {(sort || minPrice || maxPrice) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {sort && (
            <div className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm">
              {sort === "-created_at"
                ? "New products first"
                : sort === "created_at"
                ? "Old products first"
                : sort === "price"
                ? "Price: low to high"
                : sort === "-price"
                ? "Price: high to low"
                : sort}
              <button
                onClick={() => handleRemoveFilter("sort")}
                className="ml-2 font-bold hover:text-red-600"
                aria-label="Remove sort filter"
              >
                ×
              </button>
            </div>
          )}
          {minPrice && (
            <div className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm">
              Min: ${minPrice}
              <button
                onClick={() => handleRemoveFilter("minPrice")}
                className="ml-2 font-bold hover:text-red-600"
                aria-label="Remove minimum price filter"
              >
                ×
              </button>
            </div>
          )}
          {maxPrice && (
            <div className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm">
              Max: ${maxPrice}
              <button
                onClick={() => handleRemoveFilter("maxPrice")}
                className="ml-2 font-bold hover:text-red-600"
                aria-label="Remove maximum price filter"
              >
                ×
              </button>
            </div>
          )}
          <button
            onClick={handleClearFilters}
            className="ml-2 px-3 py-1 bg-[#FF4000] text-white rounded-full text-sm hover:bg-[#E63900] transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FF4000] border-t-transparent mb-4" />
            <div className="text-[#10151F] font-['Poppins']">
              Loading products...
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center">
            <span className="font-['Poppins']">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-12 mb-8">
            {products.map((product) => (
              <div key={product.id} className="flex justify-center">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  cover_image={product.cover_image}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-[#10151F] mb-2 font-['Poppins']">
            No products found
          </h3>
          <p className="text-[#3E424A] font-['Poppins'] text-sm">
            {minPrice || maxPrice || sort
              ? "Try adjusting your filters or clear them to see all products"
              : "Check back later or try refreshing the page"}
          </p>
          {(minPrice || maxPrice || sort) && (
            <button
              onClick={handleClearFilters}
              className="mt-4 px-6 py-2 bg-[#FF4000] text-white rounded-lg hover:bg-[#E63900] transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
