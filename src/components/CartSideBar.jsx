// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import ShoppingCartIcon from "./ShoppingCartIcon";

// const CartSideBar = ({
//   isOpen,
//   onClose,
//   cartItems = [],
//   onUpdateQuantity,
//   onRemoveItem,
// }) => {
//   const [items, setItems] = useState(cartItems);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     setItems(cartItems);
//   }, [cartItems]);

//   const calculateSubtotal = () => {
//     return items.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const deliveryFee = 5;
//   const subtotal = calculateSubtotal();
//   const total = subtotal + deliveryFee;

//   const handleQuantityChange = async (productId, newQuantity) => {
//     if (newQuantity < 1) return;

//     setIsLoading(true);
//     try {
//       await onUpdateQuantity(productId, newQuantity);
//       setItems((prevItems) =>
//         prevItems.map((item) =>
//           item.id === productId ? { ...item, quantity: newQuantity } : item
//         )
//       );
//     } catch (error) {
//       console.error("Failed to update quantity:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRemoveItem = async (productId) => {
//     setIsLoading(true);
//     try {
//       await onRemoveItem(productId);
//       setItems((prevItems) =>
//         prevItems.filter((item) => item.id !== productId)
//       );
//     } catch (error) {
//       console.error("Failed to remove item:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const router = useRouter();

//   const handlePostCheckoutActions = () => {
//     onClose();
//     router.push("/checkout");
//   };

//   const XIcon = () => (
//     <span className="block w-5 h-5 relative">
//       <span className="absolute inset-0 flex items-center justify-center text-2xl leading-none font-light">
//         ×
//       </span>
//     </span>
//   );

//   const MinusIcon = () => (
//     <span className=" w-2.5 h-2.5 flex items-center justify-center">
//       <span className="block w-full h-0.5 bg-gray-400"></span>
//     </span>
//   );

//   const PlusIcon = () => (
//     <span className="block w-2.5 h-2.5 relative">
//       <span className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600 -translate-y-1/2"></span>
//       <span className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-600 -translate-x-1/2"></span>
//     </span>
//   );

//   const EmptyCart = () => (
//     <div className="flex flex-col items-center justify-center h-full pt-32">
//       <div className="mb-8">
//         <div className="w-44 h-36 rounded-lg flex items-center justify-center mb-8">
//           <ShoppingCartIcon className="w-16 h-16 text-red-500" />
//         </div>
//       </div>
//       <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ooops!</h3>
//       <p className="text-sm text-gray-600 text-center mb-12 px-8">
//         You've got nothing in your cart just yet...
//       </p>
//       <button
//         onClick={onClose}
//         className="bg-red-500 hover:bg-red-600 text-white font-normal text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
//       >
//         Start shopping{" "}
//       </button>
//     </div>
//   );

//   const CartItem = ({ item }) => (
//     <div className="flex items-center gap-4 p-0">
//       <div className="relative w-24 h-32 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
//         {item.cover_image ? (
//           <Image
//             src={item.cover_image}
//             alt={item.name}
//             fill
//             className="object-cover"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//             <span className="text-gray-400 text-xs">No image</span>
//           </div>
//         )}
//       </div>

//       <div className="flex-1 flex flex-col gap-3">
//         <div className="flex justify-between items-start gap-4">
//           <div className="flex-1">
//             <h4 className="text-sm font-medium text-gray-900 leading-tight mb-2">
//               {item.name}
//             </h4>
//             {item.color && (
//               <p className="text-xs text-gray-600 mb-1">{item.color}</p>
//             )}
//             {item.size && <p className="text-xs text-gray-600">{item.size}</p>}
//           </div>
//           <div className="text-lg font-medium text-gray-900">
//             ${item.total_price || item.price}
//           </div>
//         </div>

//         <div className="flex justify-between items-center">
//           <div className="flex items-center border border-gray-200 rounded-full px-2 py-1">
//             <button
//               onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
//               disabled={isLoading || item.quantity <= 1}
//               className="w-4 h-4 flex items-center justify-center disabled:opacity-50 cursor-pointer"
//             >
//               <MinusIcon />
//             </button>
//             <span className="mx-2 text-xs text-gray-600 min-w-[16px] text-center">
//               {item.quantity}
//             </span>
//             <button
//               onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
//               disabled={isLoading}
//               className="w-4 h-4 flex items-center justify-center disabled:opacity-50 cursor-pointer"
//             >
//               <PlusIcon />
//             </button>
//           </div>

//           <button
//             onClick={() => handleRemoveItem(item.id)}
//             disabled={isLoading}
//             className="text-xs text-gray-600 opacity-80 hover:opacity-100 disabled:opacity-50 cursor-pointer"
//           >
//             Remove
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/10 bg-opacity-25"
//         onClick={onClose}
//       />

//       {/* Sidebar */}
//       <div className="absolute right-0 top-0 h-full w-[540px] bg-gray-50 border-l border-gray-200 flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between p-10 pb-6 flex-shrink-0">
//           <h2 className="text-xl font-medium text-gray-900">
//             Shopping cart ({items.length})
//           </h2>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
//           >
//             <XIcon />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 flex flex-col min-h-0">
//           {items.length === 0 ? (
//             <EmptyCart />
//           ) : (
//             <>
//               {/* Cart Items - Scrollable */}
//               <div className="flex-1 px-10 space-y-10 overflow-y-auto min-h-0">
//                 {items.map((item) => (
//                   <CartItem key={item.id} item={item} />
//                 ))}
//               </div>

//               {/* Summary - Fixed at bottom */}
//               <div className="px-10 py-6 space-y-4 border-t border-gray-200 bg-white flex-shrink-0">
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-base text-gray-600">
//                       Items subtotal
//                     </span>
//                     <span className="text-base text-gray-600">
//                       ${subtotal.toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-base text-gray-600">Delivery</span>
//                     <span className="text-base text-gray-600">
//                       ${deliveryFee}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center pt-2 border-t border-gray-200">
//                     <span className="text-xl font-medium text-gray-900">
//                       Total
//                     </span>
//                     <span className="text-xl font-medium text-gray-900">
//                       ${total.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Checkout Button */}
//                 <button
//                   onClick={handlePostCheckoutActions}
//                   disabled={isLoading || cartItems.length === 0}
//                   className="w-full  bg-[#FF4000] hover:bg-[#E63600] disabled:bg-gray-300 text-white font-medium text-lg py-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
//                 >
//                   {isLoading ? (
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   ) : (
//                     <span>Go to checkout</span>
//                   )}
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartSideBar;

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
    async (productId, newQuantity) => {
      if (newQuantity < 1 || isLoading) return;

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
        // Optionally show error toast here
      } finally {
        setIsLoading(false);
      }
    },
    [onUpdateQuantity, isLoading]
  );

  const handleRemoveItem = useCallback(
    async (productId) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        await onRemoveItem(productId);
        setItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );
      } catch (error) {
        console.error("Failed to remove item:", error);
        // Optionally show error toast here
      } finally {
        setIsLoading(false);
      }
    },
    [onRemoveItem, isLoading]
  );

  const handleCheckout = useCallback(() => {
    onClose();
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
            Shopping cart {items.length > 0 && `(${items.length})`}
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
                {items.map((item) => (
                  <CartItem
                    key={item.id}
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
      Your cart is empty
    </h3>
    <p className="text-sm text-gray-600 text-center mb-8 sm:mb-12 max-w-xs">
      Looks like you haven't added anything to your cart yet
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
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={isLoading || item.quantity <= 1}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center disabled:opacity-50 transition-opacity"
              aria-label="Decrease quantity"
            >
              <MinusIcon />
            </button>
            <span className="px-3 text-xs sm:text-sm text-gray-700 min-w-[32px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={isLoading}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center disabled:opacity-50 transition-opacity"
              aria-label="Increase quantity"
            >
              <PlusIcon />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            disabled={isLoading}
            className="text-xs text-gray-600 hover:text-red-600 disabled:opacity-50 transition-colors"
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
