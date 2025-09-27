"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { addToCart as addToCartAPI } from "@/services/api";
import { toast, Bounce } from "react-toastify";

export default function ProductDetailClient({ product, onAddToCart }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product?.available_colors?.[0] || "Default"
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.available_sizes?.[0] || "M"
  );
  const [quantity, setQuantity] = useState(1);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const selectedImage = useMemo(
    () => product?.images?.[selectedImageIndex] || product?.cover_image,
    [selectedImageIndex, product]
  );

  const currentPrice = useMemo(
    () => (product?.price * quantity).toFixed(2),
    [product?.price, quantity]
  );

  const handleColorSelect = useCallback((color, index) => {
    setSelectedColor(color);
    setSelectedImageIndex(index);
    setIsImageLoading(true);
  }, []);

  const handleImageSelect = useCallback(
    (index) => {
      setSelectedImageIndex(index);
      if (product?.available_colors?.[index]) {
        setSelectedColor(product.available_colors[index]);
      }
      setIsImageLoading(true);
    },
    [product]
  );

  // Dispatch cart update event to notify other components
  const dispatchCartUpdate = useCallback(() => {
    // Trigger a cart refresh in the header by dispatching a custom event
    window.dispatchEvent(new CustomEvent("cartRefreshNeeded"));
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!product || isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      // Create the cart item data
      const cartItemData = {
        id: product.id,
        name: product.name,
        price: product.price,
        cover_image: selectedImage,
        image: selectedImage, // Fallback for compatibility
        color: selectedColor,
        size: selectedSize,
        quantity,
        brand: product.brand?.name || "Unknown",
        brandLogo: product.brand?.image || null,
        total_price: product.price * quantity,
      };

      // Call the backend API first
      await addToCartAPI(product.id, {
        quantity,
        color: selectedColor,
        size: selectedSize,
      });

      // Update local cart state if onAddToCart callback is provided
      if (onAddToCart) {
        onAddToCart(cartItemData);
      }

      // Dispatch event to trigger cart refresh in header
      dispatchCartUpdate();

      // Reset quantity to 1 after successful add
      setQuantity(1);

      // Show success toast
      toast.success("Product added to cart!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (err) {
      console.error("Failed to add product to cart:", err);

      // Show error toast with more specific error message
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to add product to cart.";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsAddingToCart(false);
    }
  }, [
    product,
    quantity,
    selectedColor,
    selectedSize,
    selectedImage,
    onAddToCart,
    dispatchCartUpdate,
    isAddingToCart,
  ]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Add null checks for product.images
      if (e.key === "ArrowLeft" && selectedImageIndex > 0) {
        handleImageSelect(selectedImageIndex - 1);
      } else if (
        e.key === "ArrowRight" &&
        product?.images?.length &&
        selectedImageIndex < product.images.length - 1
      ) {
        handleImageSelect(selectedImageIndex + 1);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedImageIndex, product, handleImageSelect]);

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Product not found</p>
      </div>
    );

  return (
    <div className="relative w-full min-h-screen bg-white font-['Poppins',sans-serif]">
      <nav className="px-4 md:px-8 lg:px-[100px] pb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <a
              href="/listing"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Listing
            </a>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">Product</li>
        </ol>
      </nav>

      <div className="px-4 md:px-8 lg:px-[100px] pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Thumbnails */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4 space-y-2">
              {product?.images?.map((img, index) => (
                <button
                  key={`thumb-${index}`}
                  onClick={() => handleImageSelect(index)}
                  className={`w-full aspect-[3/4] overflow-hidden rounded-md border-2 transition-all duration-200 cursor-pointer ${
                    selectedImageIndex === index
                      ? "border-[#FF4000] shadow-lg"
                      : "border-[#E1DFE1] hover:border-gray-300"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - View ${index + 1}`}
                    width={121}
                    height={161}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Main Image */}
          <div className="lg:col-span-6">
            {/* Mobile Thumbnails */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 lg:hidden">
              {product?.images?.map((img, index) => (
                <button
                  key={`mobile-thumb-${index}`}
                  onClick={() => handleImageSelect(index)}
                  className={`flex-shrink-0 w-20 h-24 overflow-hidden rounded-md border-2 transition-all duration-200 cursor-pointer ${
                    selectedImageIndex === index
                      ? "border-[#FF4000] shadow-md"
                      : "border-[#E1DFE1]"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    width={80}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>

            {/* Main Product Image */}
            <div className="relative w-full max-w-[703px] h-[937px] rounded-[10px] overflow-hidden bg-gray-100 mx-auto">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                  <div className="w-8 h-8 border-3 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
                </div>
              )}
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover rounded-[10px]"
                priority
                onLoad={() => setIsImageLoading(false)}
              />
            </div>
          </div>

          {/* Right Info */}
          <div className="lg:col-span-5 space-y-6">
            <h1 className="text-2xl md:text-3xl lg:text-[32px] font-semibold text-[#10151F] leading-tight mb-5">
              {product.name}
            </h1>
            <p className="text-2xl md:text-3xl lg:text-[32px] font-semibold text-[#10151F] mb-14">
              ${currentPrice}
            </p>

            {/* Color Selection */}
            {product?.available_colors?.length > 0 && (
              <div className="space-y-4">
                <p className="text-base font-medium text-[#10151F]">
                  Color: <span className="font-normal">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.available_colors.map((color, index) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color, index)}
                      className={`relative w-10 h-10 rounded-full border-2 transition-transform duration-200 cursor-pointer ${
                        selectedColor === color
                          ? "border-[#FF4000] shadow-lg scale-110"
                          : "border-[#E1DFE1]"
                      }`}
                      style={{
                        backgroundColor:
                          color.toLowerCase() === "white"
                            ? "#ffffff"
                            : color.toLowerCase() === "multi"
                            ? "linear-gradient(45deg, #ff0000, #00ff00, #0000ff)"
                            : color.toLowerCase(),
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product?.available_sizes?.length > 0 && (
              <div className="space-y-4">
                <p className="text-base font-medium text-[#10151F]">
                  Size: <span className="font-normal">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.available_sizes.map((size, i) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-[70px] h-[42px] flex justify-center items-center rounded-lg border cursor-pointer ${
                        selectedSize === size
                          ? "bg-[#F8F6F7] border-[#10151F]"
                          : "border-[#E1DFE1]"
                      }`}
                    >
                      <span className="text-[#10151F] text-[16px] font-normal opacity-80">
                        {size}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-4">
              <p className="text-base font-medium text-[#10151F] mb-4">
                Quantity
              </p>
              <div className="relative w-[70px]">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="appearance-none w-full h-[42px] px-4 py-[9px] border border-[#E1DFE1] rounded-[10px] text-[#10151F] font-[Poppins] font-normal text-[16px] leading-[24px] opacity-80 bg-transparent focus:outline-none"
                  disabled={isAddingToCart}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>

                {/* Chevron */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.23017 7.21967C5.52306 6.92678 6.01794 6.92678 6.31083 7.21967L10 10.9393L13.6892 7.21967C13.9821 6.92678 14.4769 6.92678 14.7698 7.21967C15.0627 7.51256 15.0627 8.00744 14.7698 8.30033L10.5303 12.5303C10.2374 12.8232 9.74254 12.8232 9.44965 12.5303L5.23017 8.30033C4.93728 8.00744 4.93728 7.51256 5.23017 7.21967Z"
                      fill="#10151F"
                      opacity="0.8"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`w-full px-6 py-4 rounded-lg font-medium mt-14 cursor-pointer transition-all duration-200 ${
                isAddingToCart
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-[#FF4000] text-white hover:bg-[#E63600]"
              }`}
            >
              {isAddingToCart ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding to cart...</span>
                </div>
              ) : (
                "Add to cart"
              )}
            </button>

            <div className="w-full h-px bg-gray-300 my-14"></div>

            {/* Details with Brand */}
            <div className="flex flex-col w-full max-w-[704px] gap-7">
              <div className="flex justify-between items-center w-full h-[61px]">
                <h2 className="text-[20px] font-medium text-[#10151F] leading-[30px]">
                  Details
                </h2>
                <div className="w-[109px] h-[61px] relative">
                  <Image
                    src={product.brand?.image || "/placeholder.png"}
                    alt={`${product.brand?.name || "Brand"} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[19px]">
                <p className="text-[16px] font-normal text-[#3E424A] leading-[24px]">
                  Brand: {product.brand?.name || "Unknown"}
                </p>
                <p className="text-[16px] font-normal text-[#3E424A] leading-[24px]">
                  {product.description ||
                    "This product contains regenerative cotton, which is grown using farming methods that seek to improve soil health, watersheds and biodiversity."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
