import Image from "next/image";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import ShoppingCartIcon from "./ShoppingCartIcon";

const CartSideBar = ({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const [items, setItems] = useState(cartItems);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  const totalQuantity = useMemo(
    () => items.reduce((acc, item) => acc + (item.quantity || 0), 0),
    [items]
  );

  // Dispatch cart update event to notify other components
  const dispatchCartUpdate = useCallback((updatedItems) => {
    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { cartItems: updatedItems },
      })
    );
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Memoized calculations
  const { subtotal, total } = useMemo(() => {
    const deliveryFee = 5;
    const sub = items.reduce((acc, item) => {
      const price = item.total_price || item.price || 0;
      return acc + price * (item.quantity || 0);
    }, 0);
    return {
      subtotal: sub,
      total: sub + deliveryFee,
    };
  }, [items]);

  const handleQuantityChange = useCallback(
    async (productId, newQuantity, color, size) => {
      if (newQuantity < 1 || isLoading) return;

      setIsLoading(true);

      // Optimistically update local state with proper item identification
      const updatedItems = items.map((item) => {
        if (
          item.id === productId &&
          (item.color || "") === (color || "") &&
          (item.size || "") === (size || "")
        ) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setItems(updatedItems);

      // Dispatch event to update header cart count immediately
      dispatchCartUpdate(updatedItems);

      try {
        await onUpdateQuantity(productId, newQuantity, color, size);
      } catch (error) {
        console.error("Failed to update quantity:", error);
        // Revert local state on error
        setItems(items);
        dispatchCartUpdate(items);
      } finally {
        setIsLoading(false);
      }
    },
    [onUpdateQuantity, isLoading, items, dispatchCartUpdate]
  );

  const handleRemoveItem = useCallback(
    async (productId, color, size) => {
      if (isLoading) return;

      setIsLoading(true);

      // Optimistically update local state with proper item identification
      const updatedItems = items.filter((item) => {
        return !(
          item.id === productId &&
          (item.color || "") === (color || "") &&
          (item.size || "") === (size || "")
        );
      });
      setItems(updatedItems);

      // Dispatch event to update header cart count immediately
      dispatchCartUpdate(updatedItems);

      try {
        await onRemoveItem(productId, color, size);
      } catch (error) {
        console.error("Failed to remove item:", error);
        // Revert local state on error
        setItems(items);
        dispatchCartUpdate(items);
      } finally {
        setIsLoading(false);
      }
    },
    [onRemoveItem, isLoading, items, dispatchCartUpdate]
  );

  const handleCheckout = useCallback(() => {
    onClose();
    router.refresh();
    router.push("/checkout");
  }, [onClose, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[440px] md:w-[480px] lg:w-[540px] bg-gray-50 border-l border-gray-200 flex flex-col transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 lg:p-10 pb-4 sm:pb-6 flex-shrink-0 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-medium text-gray-900">
            Shopping cart {totalQuantity > 0 && `(${totalQuantity})`}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <XIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {items.length === 0 ? (
            <EmptyCart onClose={onClose} />
          ) : (
            <>
              {/* Cart Items - Scrollable */}
              <div className="flex-1 p-6 sm:p-8 lg:px-10 space-y-6 sm:space-y-8 lg:space-y-10 overflow-y-auto overscroll-contain">
                {items.map((item, index) => (
                  <CartItem
                    key={`${item.id}-${item.color || "no-color"}-${
                      item.size || "no-size"
                    }-${index}`}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    isLoading={isLoading}
                  />
                ))}
              </div>

              {/* Summary - Fixed at bottom */}
              <CartSummary
                subtotal={subtotal}
                total={total}
                onCheckout={handleCheckout}
                isLoading={isLoading}
                isEmpty={items.length === 0}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Icon Components
const XIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const MinusIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 12H4"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

// Empty Cart Component
const EmptyCart = ({ onClose }) => (
  <div className="flex flex-col items-center justify-center h-full px-8 pb-20">
    <div className="mb-6 sm:mb-8">
      <ShoppingCartIcon className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />
    </div>
    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
      Ooops!{" "}
    </h3>
    <p className="text-sm text-gray-600 text-center mb-8 sm:mb-12 max-w-xs">
      You've got nothing in your cart just yet...{" "}
    </p>
    <button
      onClick={onClose}
      className="bg-red-500 hover:bg-red-600 text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer"
    >
      Start shopping
    </button>
  </div>
);

// Cart Item Component
const CartItem = ({ item, onQuantityChange, onRemove, isLoading }) => {
  const itemPrice = item.total_price || item.price || 0;

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* Product Image */}
      <div className="relative w-20 h-28 sm:w-24 sm:h-32 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
        {item.cover_image ? (
          <Image
            src={item.cover_image}
            alt={item.name || "Product image"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 80px, 96px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col gap-2 sm:gap-3 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 leading-tight mb-1 sm:mb-2 line-clamp-2">
              {item.name}
            </h4>
            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              {item.color && <span>Color: {item.color}</span>}
              {item.size && <span>Size: {item.size}</span>}
            </div>
          </div>
          <div className="text-base sm:text-lg font-medium text-gray-900 flex-shrink-0">
            ${itemPrice.toFixed(2)}
          </div>
        </div>

        {/* Quantity and Remove */}
        <div className="flex justify-between items-center">
          <div className="flex items-center border border-gray-200 rounded-full">
            <button
              onClick={() =>
                onQuantityChange(
                  item.id,
                  item.quantity - 1,
                  item.color,
                  item.size
                )
              }
              disabled={isLoading || item.quantity <= 1}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center disabled:opacity-50 transition-opacity cursor-pointer"
              aria-label="Decrease quantity"
            >
              <MinusIcon />
            </button>
            <span className="px-3 text-xs sm:text-sm text-gray-700 min-w-[32px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onQuantityChange(
                  item.id,
                  item.quantity + 1,
                  item.color,
                  item.size
                )
              }
              disabled={isLoading}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center disabled:opacity-50 transition-opacity cursor-pointer"
              aria-label="Increase quantity"
            >
              <PlusIcon />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id, item.color, item.size)}
            disabled={isLoading}
            className="text-xs text-gray-600 hover:text-red-600 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

// Cart Summary Component
const CartSummary = ({ subtotal, total, onCheckout, isLoading, isEmpty }) => {
  const deliveryFee = 5;

  return (
    <div className="p-6 sm:p-8 lg:px-10 space-y-4 border-t border-gray-200 bg-white flex-shrink-0">
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm sm:text-base">
          <span className="text-gray-600">Items subtotal</span>
          <span className="text-gray-700">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm sm:text-base">
          <span className="text-gray-600">Delivery</span>
          <span className="text-gray-700">${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-lg sm:text-xl font-medium text-gray-900">
            Total
          </span>
          <span className="text-lg sm:text-xl font-medium text-gray-900">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={isLoading || isEmpty}
        className="w-full bg-[#FF4000] hover:bg-[#E63600] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium text-base sm:text-lg py-3 sm:py-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <span>Go to checkout</span>
        )}
      </button>
    </div>
  );
};

export default CartSideBar;
