import Image from "next/image";
import React, { useState, useEffect } from "react";

const CartSideBar = ({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [items, setItems] = useState(cartItems);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const deliveryFee = 5;
  const subtotal = calculateSubtotal();
  const total = subtotal + deliveryFee;

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setIsLoading(true);
    try {
      await onUpdateQuantity(productId, newQuantity);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    setIsLoading(true);
    try {
      await onRemoveItem(productId);
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      await onCheckout();
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const XIcon = () => (
    <span className="block w-5 h-5 relative">
      <span className="absolute inset-0 flex items-center justify-center text-2xl leading-none font-light">
        ×
      </span>
    </span>
  );

  const MinusIcon = () => (
    <span className="block w-2.5 h-2.5 flex items-center justify-center">
      <span className="block w-full h-0.5 bg-gray-400"></span>
    </span>
  );

  const PlusIcon = () => (
    <span className="block w-2.5 h-2.5 relative">
      <span className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600 -translate-y-1/2"></span>
      <span className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-600 -translate-x-1/2"></span>
    </span>
  );

  const ShoppingCartIcon = ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
        fill="currentColor"
      />
      <path
        d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
        fill="currentColor"
      />
      <path
        d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6M6 6L5 1M6 6H23"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center h-full pt-32">
      <div className="mb-8">
        <div className="w-44 h-36 bg-gray-100 rounded-lg flex items-center justify-center mb-8">
          <ShoppingCartIcon className="w-16 h-16 text-red-500" />
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ooops!</h3>
      <p className="text-sm text-gray-600 text-center mb-12 px-8">
        You've got nothing in your cart just yet...
      </p>
      <button
        onClick={onClose}
        className="bg-red-500 hover:bg-red-600 text-white font-normal text-sm px-5 py-2.5 rounded-lg transition-colors"
      >
        Add to cart
      </button>
    </div>
  );

  const CartItem = ({ item }) => (
    <div className="flex items-center gap-4 p-0">
      <div className="relative w-24 h-32 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
        {item.cover_image ? (
          <Image
            src={item.cover_image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 leading-tight mb-2">
              {item.name}
            </h4>
            {item.color && (
              <p className="text-xs text-gray-600 mb-1">{item.color}</p>
            )}
            {item.size && <p className="text-xs text-gray-600">{item.size}</p>}
          </div>
          <div className="text-lg font-medium text-gray-900">
            ${item.total_price || item.price}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center border border-gray-200 rounded-full px-2 py-1">
            <button
              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              disabled={isLoading || item.quantity <= 1}
              className="w-4 h-4 flex items-center justify-center disabled:opacity-50"
            >
              <MinusIcon />
            </button>
            <span className="mx-2 text-xs text-gray-600 min-w-[16px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              disabled={isLoading}
              className="w-4 h-4 flex items-center justify-center disabled:opacity-50"
            >
              <PlusIcon />
            </button>
          </div>

          <button
            onClick={() => handleRemoveItem(item.id)}
            disabled={isLoading}
            className="text-xs text-gray-600 opacity-80 hover:opacity-100 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/10" onClick={onClose} />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-[540px] bg-gray-50 border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-10 pb-6">
          <h2 className="text-xl font-medium text-gray-900">
            Shopping cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 px-10 space-y-10 overflow-y-auto">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Summary */}
              <div className="px-10 py-6 space-y-4 border-t border-gray-200 bg-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600">
                      Items subtotal
                    </span>
                    <span className="text-base text-gray-600">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600">Delivery</span>
                    <span className="text-base text-gray-600">
                      ${deliveryFee}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-xl font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-medium text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || items.length === 0}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-medium text-lg py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-6 h-6" />
                      <span>Checkout</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSideBar;
