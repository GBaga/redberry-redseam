// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import React, { useState } from "react";

// const CartSideBar = ({
//   isOpen,
//   onClose,
//   cartItems = [],
//   onUpdateQuantity,
//   onRemoveItem,
//   onCheckout,
//   isLoading,
// }) => {
//   if (!isOpen) return null;

//   const deliveryFee = 5;
//   const subtotal = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );
//   const total = subtotal + deliveryFee;

//   const handleQuantityChange = (item, newQuantity) => {
//     if (newQuantity < 1) return;
//     onUpdateQuantity(item.id, newQuantity, item.color, item.size);
//   };

//   const handleRemove = (item) => {
//     onRemoveItem(item.id, item.color, item.size);
//   };

//   const XIcon = () => (
//     <span className="block w-5 h-5 relative">
//       <span className="absolute inset-0 flex items-center justify-center text-2xl leading-none font-light">
//         ×
//       </span>
//     </span>
//   );

//   const MinusIcon = () => (
//     <span className="block w-2.5 h-2.5 items-center justify-center">
//       <span className="block w-full h-0.5 bg-gray-400"></span>
//     </span>
//   );

//   const PlusIcon = () => (
//     <span className="block w-2.5 h-2.5 relative">
//       <span className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600 -translate-y-1/2"></span>
//       <span className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-600 -translate-x-1/2"></span>
//     </span>
//   );

//   const ShoppingCartIcon = ({ className = "w-6 h-6" }) => (
//     <svg
//       className={className}
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
//         fill="currentColor"
//       />
//       <path
//         d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
//         fill="currentColor"
//       />
//       <path
//         d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6M6 6L5 1M6 6H23"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );

//   const EmptyCart = () => (
//     <div className="flex flex-col items-center justify-center h-full pt-32">
//       <div className="mb-8">
//         <div className="w-44 h-36 bg-gray-100 rounded-lg flex items-center justify-center mb-8">
//           <ShoppingCartIcon className="w-16 h-16 text-red-500" />
//         </div>
//       </div>
//       <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ooops!</h3>
//       <p className="text-sm text-gray-600 text-center mb-12 px-8">
//         You've got nothing in your cart just yet...
//       </p>
//       <button
//         onClick={onClose}
//         className="bg-red-500 hover:bg-red-600 text-white font-normal text-sm px-5 py-2.5 rounded-lg transition-colors"
//       >
//         Add to cart
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
//           <div className="text-lg font-medium text-gray-900">${item.price}</div>
//         </div>

//         <div className="flex justify-between items-center">
//           <div className="flex items-center border border-gray-200 rounded-full px-2 py-1">
//             <button
//               onClick={() => handleQuantityChange(item, item.quantity - 1)}
//               disabled={isLoading || item.quantity <= 1}
//               className="w-4 h-4 flex items-center justify-center disabled:opacity-50"
//             >
//               <MinusIcon />
//             </button>
//             <span className="mx-2 text-xs text-gray-600 min-w-[16px] text-center">
//               {item.quantity}
//             </span>
//             <button
//               onClick={() => handleQuantityChange(item, item.quantity + 1)}
//               disabled={isLoading}
//               className="w-4 h-4 flex items-center justify-center disabled:opacity-50"
//             >
//               <PlusIcon />
//             </button>
//           </div>

//           <button
//             onClick={() => handleRemove(item)}
//             disabled={isLoading}
//             className="text-xs text-gray-600 opacity-80 hover:opacity-100 disabled:opacity-50"
//           >
//             Remove
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 z-50">
//       {/* Backdrop */}
//       <div className="absolute inset-0 bg-black/10" onClick={onClose} />

//       {/* Sidebar */}
//       <div className="absolute right-0 top-0 h-full w-[540px] bg-gray-50 border-l border-gray-200 flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between p-10 pb-6">
//           <h2 className="text-xl font-medium text-gray-900">
//             Shopping cart ({cartItems.length})
//           </h2>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <XIcon />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 flex flex-col">
//           {cartItems.length === 0 ? (
//             <EmptyCart />
//           ) : (
//             <>
//               <div className="flex-1 px-10 space-y-10 overflow-y-auto">
//                 {cartItems.map((item) => (
//                   <CartItem
//                     key={`${item.id}-${item.color}-${item.size}`}
//                     item={item}
//                   />
//                 ))}
//               </div>

//               {/* Summary */}
//               <div className="px-10 py-6 space-y-4 border-t border-gray-200 bg-white">
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
//                 {/* <button
//                   onClick={onCheckout}
//                   disabled={isLoading || cartItems.length === 0}
//                   className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-medium text-lg py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
//                 >
//                   {isLoading ? (
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   ) : (
//                     <>
//                       <ShoppingCartIcon className="w-6 h-6" />
//                       <span>Checkout</span>
//                     </>
//                   )}
//                 </button> */}

//                 <Link
//                   href={"/checkout"}
//                   onClick={onCheckout}
//                   disabled={isLoading || cartItems.length === 0}
//                   className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-medium text-lg py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
//                 >
//                   {isLoading ? (
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   ) : (
//                     <>
//                       <ShoppingCartIcon className="w-6 h-6" />
//                       <span>Checkout</span>
//                     </>
//                   )}
//                 </Link>
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
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      await onCheckout(); // Execute checkout logic (API calls, etc.)
      onClose(); // Close sidebar after successful checkout
      router.push("/checkout"); // Navigate to checkout page
    } catch (error) {
      console.error("Checkout failed:", error);
      // Keep sidebar open on error so user can see what went wrong
      // Optionally show an error message to the user
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
    <span className=" w-2.5 h-2.5 flex items-center justify-center">
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
      width="122"
      height="99"
      viewBox="0 0 122 99"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <mask
        id="mask0_84_263"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="122"
        height="99"
      >
        <path
          d="M0.935547 0.86499H121.056V98.6552H0.935547V0.86499Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_84_263)">
        <path
          d="M93.3071 64.7615H12.4111C11.3324 64.7615 10.3078 64.2945 9.60001 63.4804C8.89226 62.6662 8.57261 61.5866 8.72292 60.5185L16.2499 6.9622C16.5067 5.13453 18.0923 3.75623 19.9381 3.75623H117.328C118.596 3.75623 119.765 4.39187 120.454 5.45646C121.144 6.52104 121.245 7.84767 120.726 9.00479L96.7054 62.5613C96.1058 63.8978 94.772 64.7615 93.3071 64.7615ZM19.9379 5.50202C18.9573 5.50202 18.115 6.23421 17.9784 7.20522L10.4518 60.7617C10.372 61.3291 10.542 61.9026 10.9179 62.3352C11.2938 62.7678 11.8381 63.0157 12.4113 63.0157H93.3073C94.0854 63.0157 94.7942 62.5569 95.1128 61.8467L119.133 8.29041C119.413 7.66646 119.361 6.97931 118.989 6.4053C118.617 5.8311 118.012 5.50185 117.328 5.50185H19.9379V5.50202Z"
          fill="#FF4000"
        />
        <path
          d="M79.6736 86.6006H12.1184C10.2378 86.6006 8.45312 85.7852 7.22216 84.3636C5.99102 82.9418 5.43935 81.059 5.70838 79.1978L10.244 47.8129C10.3127 47.3358 10.7553 47.0044 11.2326 47.0739C11.7097 47.1429 12.0407 47.5856 11.9716 48.0625L7.43602 79.4474C7.23962 80.807 7.64272 82.1824 8.5418 83.2208C9.44089 84.2592 10.7446 84.8548 12.1182 84.8548H79.6736C80.1557 84.8548 80.5465 85.2455 80.5465 85.7277C80.5465 86.2099 80.1557 86.6006 79.6736 86.6006Z"
          fill="#FF4000"
        />
        <path
          d="M17.4061 98.6552C20.346 98.6552 22.7292 96.272 22.7292 93.3321C22.7292 90.3923 20.346 88.009 17.4061 88.009C14.4662 88.009 12.083 90.3923 12.083 93.3321C12.083 96.272 14.4662 98.6552 17.4061 98.6552Z"
          fill="#FF4000"
        />
        <path
          d="M4.69948 8.39286C6.77825 8.39286 8.46342 6.70769 8.46342 4.62893C8.46342 2.55016 6.77825 0.86499 4.69948 0.86499C2.62072 0.86499 0.935547 2.55016 0.935547 4.62893C0.935547 6.70769 2.62072 8.39286 4.69948 8.39286Z"
          fill="#FF4000"
        />
        <path
          d="M67.3885 98.6552C70.3284 98.6552 72.7116 96.272 72.7116 93.3321C72.7116 90.3923 70.3284 88.009 67.3885 88.009C64.4487 88.009 62.0654 90.3923 62.0654 93.3321C62.0654 96.272 64.4487 98.6552 67.3885 98.6552Z"
          fill="#FF4000"
        />
        <path
          d="M29.4089 5.50202H4.71762C4.23544 5.50202 3.84473 5.11131 3.84473 4.62912C3.84473 4.14693 4.23544 3.75623 4.71762 3.75623H29.4091C29.8913 3.75623 30.282 4.14693 30.282 4.62912C30.282 5.11131 29.8911 5.50202 29.4089 5.50202Z"
          fill="#FF4000"
        />
      </g>
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
        className="bg-red-500 hover:bg-red-600 text-white font-normal text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        Start shopping{" "}
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
              className="w-4 h-4 flex items-center justify-center disabled:opacity-50 cursor-pointer"
            >
              <MinusIcon />
            </button>
            <span className="mx-2 text-xs text-gray-600 min-w-[16px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              disabled={isLoading}
              className="w-4 h-4 flex items-center justify-center disabled:opacity-50 cursor-pointer"
            >
              <PlusIcon />
            </button>
          </div>

          <button
            onClick={() => handleRemoveItem(item.id)}
            disabled={isLoading}
            className="text-xs text-gray-600 opacity-80 hover:opacity-100 disabled:opacity-50 cursor-pointer"
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
      <div
        className="absolute inset-0 bg-black/10 bg-opacity-25"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-[540px] bg-gray-50 border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-10 pb-6">
          <h2 className="text-xl font-medium text-gray-900">
            Shopping cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
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
                  disabled={isLoading || cartItems.length === 0}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-medium text-lg py-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
