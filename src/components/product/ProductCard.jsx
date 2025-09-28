"use client";

import { useState, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";

// Constants
const PLACEHOLDER_IMAGE = "/images/placeholder.png";
const IMAGE_SIZES = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 412px";

const ProductCard = memo(function ProductCard({
  id,
  name,
  price,
  cover_image,
  priority = false,
  onImageError = null,
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
    onImageError?.(id);
  }, [id, onImageError]);

  // Handle image load complete
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  // Format price for display
  const formattedPrice = typeof price === "number" ? price.toFixed(2) : price;

  // Determine image source
  const imageSrc = imageError
    ? PLACEHOLDER_IMAGE
    : cover_image || PLACEHOLDER_IMAGE;

  return (
    <Link
      href={`/products/${id}`}
      className="group flex flex-col items-start gap-3 w-full max-w-[412px] h-[614px] cursor-pointer transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FF4000] focus:ring-offset-2 rounded-xl"
      aria-label={`View ${name} - $${formattedPrice}`}
    >
      {/* Image container */}
      <div className="w-full h-[549px] relative rounded-lg overflow-hidden bg-gray-100">
        {/* Loading skeleton */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
        )}

        {/* Product image */}
        <Image
          src={imageSrc}
          alt={name || "Product"}
          fill
          className={`object-cover transition-opacity duration-300 group-hover:scale-105 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          sizes={IMAGE_SIZES}
          priority={priority}
          onLoad={handleImageLoad}
          onError={handleImageError}
          quality={85}
        />

        {/* Always visible grey overlay */}
        <div className="absolute inset-0 bg-black opacity-5 pointer-events-none" />
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-0.5 w-full px-1">
        <h3 className="text-[18px] font-medium leading-[18px] tracking-normal text-[#10151F] line-clamp-2 group-hover:text-[#FF4000] transition-colors duration-200 pt-3 pb-1">
          {name || "Untitled Product"}
        </h3>
        <p className="text-[16px] font-medium leading-[16px] tracking-normal text-[#10151F]">
          ${formattedPrice}
        </p>
      </div>
    </Link>
  );
});

// Display name for debugging
ProductCard.displayName = "ProductCard";

export default ProductCard;

// Enhanced version with additional features
export const ProductCardWithBadge = memo(function ProductCardWithBadge({
  id,
  name,
  price,
  cover_image,
  badge,
  discount,
  priority = false,
  onImageError = null,
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
    onImageError?.(id);
  }, [id, onImageError]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  // Calculate prices
  const originalPrice =
    typeof price === "number" ? price : parseFloat(price) || 0;
  const discountedPrice = discount
    ? (originalPrice * (1 - discount / 100)).toFixed(2)
    : originalPrice.toFixed(2);

  const imageSrc = imageError
    ? PLACEHOLDER_IMAGE
    : cover_image || PLACEHOLDER_IMAGE;

  return (
    <Link
      href={`/products/${id}`}
      className="group flex flex-col items-start gap-3 w-full max-w-[412px] h-[614px] cursor-pointer transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FF4000] focus:ring-offset-2 rounded-lg"
      aria-label={`View ${name} - $${discountedPrice}`}
    >
      {/* Image container with badge */}
      <div className="w-full h-[549px] relative rounded-lg overflow-hidden bg-gray-100">
        {/* Loading skeleton */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {badge && (
            <span className="px-3 py-1 bg-[#FF4000] text-white text-xs font-medium rounded-full">
              {badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Product image */}
        <Image
          src={imageSrc}
          alt={name || "Product"}
          fill
          className={`object-cover transition-opacity duration-300 group-hover:scale-105 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          sizes={IMAGE_SIZES}
          priority={priority}
          onLoad={handleImageLoad}
          onError={handleImageError}
          quality={85}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none" />
      </div>

      {/* Text content with discount */}
      <div className="flex flex-col gap-0.5 w-full px-1">
        <h3 className="text-[18px] font-medium leading-[18px] tracking-normal text-[#10151F] line-clamp-2 group-hover:text-[#FF4000] transition-colors duration-200 ">
          {name || "Untitled Product"}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-[16px] font-medium leading-[16px] tracking-normal text-[#10151F]">
            ${discountedPrice}
          </p>
          {discount > 0 && (
            <p className="text-[14px] font-normal leading-[14px] line-through text-gray-500">
              ${originalPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
});

ProductCardWithBadge.displayName = "ProductCardWithBadge";
