"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCart, updateCartItem, removeFromCart } from "@/services/api";
import SuccessModal from "@/components/SuccessModal";

// Constants
const DELIVERY_FEE = 5;
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STORAGE_KEYS = {
  TOKEN: "token",
  CART_ITEMS: "cartItems",
};

const INITIAL_FORM_DATA = {
  name: "",
  surname: "",
  email: "",
  zip_code: "",
  address: "",
};

// Validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CheckoutPage = () => {
  const router = useRouter();

  // Combined state for better performance
  const [state, setState] = useState({
    cartItems: [],
    isLoading: false,
    showModal: false,
    formData: INITIAL_FORM_DATA,
    errors: {},
    mounted: false,
  });

  // Update state helper
  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Dispatch cart update event to notify other components
  const dispatchCartUpdate = useCallback((cartItems) => {
    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { cartItems },
      })
    );
  }, []);

  // Memoized calculations
  const { subtotal, total } = useMemo(() => {
    const sub = state.cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
    return {
      subtotal: sub,
      total: sub + DELIVERY_FEE,
    };
  }, [state.cartItems]);

  // Load user data
  const loadUserData = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.email) {
          updateState({
            formData: { ...state.formData, email: userData.email },
          });
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, [updateState, state.formData]);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      // Try API first
      const apiCart = await getCart();
      if (apiCart?.length > 0) {
        updateState({ cartItems: apiCart });
        localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(apiCart));
        dispatchCartUpdate(apiCart);
      } else {
        // Fallback to localStorage
        const savedCart = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
        if (savedCart) {
          try {
            const parsed = JSON.parse(savedCart);
            const cartItems = Array.isArray(parsed) ? parsed : [];
            updateState({ cartItems });
            dispatchCartUpdate(cartItems);
          } catch {
            updateState({ cartItems: [] });
            dispatchCartUpdate([]);
          }
        }
      }

      await loadUserData();
    } catch (error) {
      console.error("Error loading initial data:", error);

      // Fallback to localStorage on error
      const savedCart = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          const cartItems = Array.isArray(parsed) ? parsed : [];
          updateState({ cartItems });
          dispatchCartUpdate(cartItems);
        } catch {
          updateState({ cartItems: [] });
          dispatchCartUpdate([]);
        }
      }
    }
  }, [loadUserData, updateState, dispatchCartUpdate]);

  // Initialize on mount
  useEffect(() => {
    updateState({ mounted: true });
    loadInitialData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update quantity
  const updateQuantity = useCallback(
    async (itemId, change, color, size) => {
      if (!state.mounted) return;

      const item = state.cartItems.find(
        (i) =>
          i.id === itemId &&
          (i.color ?? "") === (color ?? "") &&
          (i.size ?? "") === (size ?? "")
      );
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + change);

      const updatedItems = state.cartItems.map((cartItem) => {
        if (
          cartItem.id === itemId &&
          (cartItem.color ?? "") === (color ?? "") &&
          (cartItem.size ?? "") === (size ?? "")
        ) {
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      });

      updateState({ cartItems: updatedItems });
      localStorage.setItem(
        STORAGE_KEYS.CART_ITEMS,
        JSON.stringify(updatedItems)
      );
      dispatchCartUpdate(updatedItems);

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        try {
          await updateCartItem(itemId, newQuantity, { color, size });
        } catch (error) {
          console.error("Error updating quantity:", error);
          await loadInitialData();
        }
      }
    },
    [
      state.mounted,
      state.cartItems,
      updateState,
      loadInitialData,
      dispatchCartUpdate,
    ]
  );

  // Remove item
  const removeItem = useCallback(
    async (itemId, color, size) => {
      if (!state.mounted) return;

      const updatedItems = state.cartItems.filter(
        (item) =>
          !(
            item.id === itemId &&
            (item.color ?? "") === (color ?? "") &&
            (item.size ?? "") === (size ?? "")
          )
      );

      updateState({ cartItems: updatedItems });
      localStorage.setItem(
        STORAGE_KEYS.CART_ITEMS,
        JSON.stringify(updatedItems)
      );
      dispatchCartUpdate(updatedItems);

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        try {
          await removeFromCart(itemId, { color, size });
        } catch (error) {
          console.error("Error removing item:", error);
          await loadInitialData();
        }
      }
    },
    [
      state.mounted,
      state.cartItems,
      updateState,
      loadInitialData,
      dispatchCartUpdate,
    ]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      updateState({
        formData: { ...state.formData, [name]: value },
        errors: { ...state.errors, [name]: undefined },
      });
    },
    [state.formData, state.errors, updateState]
  );

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    const { formData } = state;

    // Validation rules
    const validations = {
      name: { required: true, message: "Name is required" },
      surname: { required: true, message: "Surname is required" },
      email: {
        required: true,
        pattern: EMAIL_REGEX,
        messages: {
          required: "Email is required",
          pattern: "Please enter a valid email",
        },
      },
      zip_code: { required: true, message: "Zip code is required" },
      address: { required: true, message: "Address is required" },
    };

    Object.keys(validations).forEach((field) => {
      const value = formData[field]?.trim();
      const rules = validations[field];

      if (rules.required && !value) {
        newErrors[field] = rules.messages?.required || rules.message;
      } else if (rules.pattern && value && !rules.pattern.test(value)) {
        newErrors[field] = rules.messages?.pattern;
      }
    });

    updateState({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  }, [state.formData, updateState]);

  // Handle checkout
  const handleCheckout = useCallback(async () => {
    // Validate form
    if (!validateForm()) return;

    // Check cart
    if (!state.cartItems?.length) {
      updateState({ errors: { general: "Your cart is empty" } });
      return;
    }

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      router.push("/login");
      return;
    }

    updateState({ isLoading: true, errors: {} });

    try {
      const checkoutData = Object.keys(state.formData).reduce((acc, key) => {
        acc[key] = state.formData[key].trim();
        return acc;
      }, {});

      const response = await fetch(`${API_URL}/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(checkoutData),
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.ok) {
        // Success - clear cart everywhere
        const emptyCart = [];
        updateState({
          showModal: true,
          cartItems: emptyCart,
          formData: INITIAL_FORM_DATA,
        });
        localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
        dispatchCartUpdate(emptyCart);
      } else if (response.status === 422 && responseData.errors) {
        // Validation errors
        const serverErrors = Object.entries(responseData.errors).reduce(
          (acc, [key, value]) => {
            acc[key] = Array.isArray(value) ? value[0] : value;
            return acc;
          },
          {}
        );
        updateState({ errors: serverErrors });
      } else if (response.status === 401) {
        updateState({
          errors: { general: "Your session has expired. Please login again." },
        });
        setTimeout(() => router.push("/login"), 2000);
      } else {
        updateState({
          errors: {
            general:
              responseData.message || "Checkout failed. Please try again.",
          },
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      updateState({
        errors: {
          general: "An error occurred during checkout. Please try again.",
        },
      });
    } finally {
      updateState({ isLoading: false });
    }
  }, [
    validateForm,
    state.cartItems,
    state.formData,
    updateState,
    router,
    dispatchCartUpdate,
  ]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    updateState({ showModal: false });
    router.push("/");
  }, [updateState, router]);

  // Loading state
  if (!state.mounted) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-[100px] py-8 lg:py-[60px]">
        <h1 className="text-3xl lg:text-[42px] font-semibold text-gray-900 mb-8 lg:mb-[42px]">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[131px]">
          {/* Form Section */}
          <FormSection
            formData={state.formData}
            errors={state.errors}
            onChange={handleInputChange}
            onSubmit={handleCheckout}
          />

          {/* Order Summary Section */}
          <OrderSummary
            cartItems={state.cartItems}
            subtotal={subtotal}
            total={total}
            isLoading={state.isLoading}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {/* Success Modal */}
      {state.mounted && (
        <SuccessModal
          isOpen={state.showModal}
          onClose={handleModalClose}
          title="Congrats!"
          message="Your order is placed successfully!"
          buttonText="Continue Shopping"
        />
      )}
    </div>
  );
};

// Loading State Component
const LoadingState = () => (
  <div className="min-h-screen bg-white">
    <div className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-[100px] py-8 lg:py-[60px]">
      <h1 className="text-3xl lg:text-[42px] font-semibold text-gray-900 mb-8 lg:mb-[42px]">
        Checkout
      </h1>
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FF4000] rounded-full animate-spin" />
      </div>
    </div>
  </div>
);

// Form Section Component
const FormSection = ({ formData, errors, onChange, onSubmit }) => (
  <div className="flex-1 lg:max-w-[1129px]">
    <div className="bg-[#F8F6F7] rounded-2xl p-6 lg:p-[47px] min-h-[635px] h-full">
      <h2 className="text-xl lg:text-[22px] font-medium text-gray-700 mb-6 lg:mb-[37px]">
        Order details
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-[23px]">
          <FormInput
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Name"
            error={errors.name}
          />
          <FormInput
            name="surname"
            value={formData.surname}
            onChange={onChange}
            placeholder="Surname"
            error={errors.surname}
          />
        </div>

        <div className="mt-4 lg:mt-[23px]">
          <FormInput
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="Email"
            error={errors.email}
            icon={<EnvelopeIcon />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-[23px] mt-4 lg:mt-[23px]">
          <FormInput
            name="address"
            value={formData.address}
            onChange={onChange}
            placeholder="Address"
            error={errors.address}
          />
          <FormInput
            name="zip_code"
            value={formData.zip_code}
            onChange={onChange}
            placeholder="Zip Code"
            error={errors.zip_code}
          />
        </div>

        {errors.general && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}
      </form>
    </div>
  </div>
);

// Form Input Component
const FormInput = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  icon,
}) => (
  <div>
    <div
      className={`bg-white border rounded-lg px-3 h-[42px] flex items-center gap-2 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    >
      {icon && <span className="text-gray-600">{icon}</span>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full outline-none text-sm text-gray-900 placeholder-gray-600"
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// Order Summary Component
const OrderSummary = ({
  cartItems,
  subtotal,
  total,
  isLoading,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => (
  <div className="w-full lg:w-[460px] flex flex-col gap-[81px]">
    {/* Cart Items */}
    <div className="flex flex-col gap-[36px]">
      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <CartItem
            key={`${item.id}-${item.color || "no-color"}-${
              item.size || "no-size"
            }-${index}`}
            item={item}
            isLoading={isLoading}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemoveItem}
          />
        ))
      ) : (
        <EmptyCart />
      )}
    </div>

    {/* Summary and Checkout */}
    {cartItems.length > 0 && (
      <div className="flex flex-col gap-[16px]">
        <PriceSummary subtotal={subtotal} total={total} />
        <button
          type="button"
          onClick={onCheckout}
          disabled={isLoading || cartItems.length === 0}
          className="w-full h-[59px] bg-[#FF4000] hover:bg-[#E63600] disabled:bg-gray-300 text-white font-medium text-[18px] leading-[27px] py-[16px] px-[60px] rounded-[10px] transition-colors flex items-center justify-center gap-[10px] cursor-pointer"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Pay"
          )}
        </button>
      </div>
    )}
  </div>
);

// Cart Item Component
const CartItem = ({ item, isLoading, onUpdateQuantity, onRemove }) => (
  <div className="flex gap-[17px]">
    {/* Product Image */}
    <div className="w-[100px] h-[134px] bg-gray-100 border border-[#E1DFE1] rounded-[10px] overflow-hidden flex-shrink-0">
      {item.cover_image || item.image ? (
        <Image
          src={item.cover_image || item.image}
          alt={item.name || "Product"}
          width={100}
          height={134}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
          No image
        </div>
      )}
    </div>

    {/* Product Info */}
    <div className="w-[343px] flex flex-col gap-[13px]">
      {/* Name and Price */}
      <div className="flex justify-between items-start gap-[60px]">
        <div className="flex flex-col gap-[8px]">
          <h4 className="text-[14px] font-medium text-[#10151F] leading-[21px] max-w-[252px]">
            {item.name}
          </h4>
          {item.color && (
            <p className="text-[12px] font-normal text-[#3E424A] leading-[18px]">
              {item.color}
            </p>
          )}
          {item.size && (
            <p className="text-[12px] font-normal text-[#3E424A] leading-[18px]">
              {item.size}
            </p>
          )}
        </div>
        <div className="text-[18px] font-medium text-[#10151F] leading-[27px] text-right">
          $ {item.price}
        </div>
      </div>

      {/* Quantity and Remove */}
      <div className="flex justify-between items-center gap-[13px]">
        <QuantityControl
          quantity={item.quantity}
          onDecrease={() =>
            onUpdateQuantity(item.id, -1, item.color, item.size)
          }
          onIncrease={() =>
            onUpdateQuantity(item.id, +1, item.color, item.size)
          }
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => onRemove(item.id, item.color, item.size)}
          disabled={isLoading}
          className="text-[12px] font-normal text-[#3E424A] leading-[18px] opacity-80 hover:opacity-100 disabled:opacity-50 w-[49px] text-right cursor-pointer"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
);

// Quantity Control Component
const QuantityControl = ({ quantity, onDecrease, onIncrease, disabled }) => (
  <div className="flex items-center border border-[#E1DFE1] rounded-[22px] px-[8px] py-[4px] gap-[2px] w-[70px] h-[26px]">
    <button
      type="button"
      onClick={onDecrease}
      disabled={disabled || quantity <= 1}
      className="w-[16px] h-[16px] flex items-center justify-center disabled:opacity-50 cursor-pointer"
    >
      <MinusIcon />
    </button>
    <span className="text-[12px] font-normal text-[#3E424A] leading-[18px] w-[18px] text-center">
      {quantity}
    </span>
    <button
      type="button"
      onClick={onIncrease}
      disabled={disabled}
      className="w-[16px] h-[16px] flex items-center justify-center cursor-pointer"
    >
      <PlusIcon />
    </button>
  </div>
);

// Price Summary Component
const PriceSummary = ({ subtotal, total }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <span className="text-[16px] font-normal text-[#3E424A] leading-[24px]">
        Items subtotal
      </span>
      <span className="text-[16px] font-normal text-[#3E424A] leading-[24px] text-right">
        $ {subtotal.toFixed(0)}
      </span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-[16px] font-normal text-[#3E424A] leading-[24px]">
        Delivery
      </span>
      <span className="text-[16px] font-normal text-[#3E424A] leading-[24px] text-right">
        $ {DELIVERY_FEE}
      </span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-[20px] font-medium text-[#10151F] leading-[30px]">
        Total
      </span>
      <span className="text-[20px] font-medium text-[#10151F] leading-[30px]">
        $ {total.toFixed(0)}
      </span>
    </div>
  </div>
);

// Empty Cart Component
const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-44 h-36 bg-gray-100 rounded-lg flex items-center justify-center mb-8">
      <ShoppingCartIcon className="w-16 h-16 text-[#FF4000]" />
    </div>
    <h3 className="text-2xl font-semibold text-[#10151F] mb-2">Ooops!</h3>
    <p className="text-sm text-[#3E424A] text-center mb-12 px-8">
      You've got nothing in your cart just yet...
    </p>
    <Link
      href="/"
      className="bg-[#FF4000] hover:bg-[#E63600] text-white font-normal text-sm px-5 py-2.5 rounded-lg transition-colors"
    >
      Start Shopping
    </Link>
  </div>
);

// Icon Components
const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8h10"
      stroke="#E1DFE1"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 3v10M3 8h10"
      stroke="#3E424A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const EnvelopeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
    <rect
      x="2"
      y="4"
      width="16"
      height="12"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M2 6L10 11L18 6"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

const ShoppingCartIcon = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
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

export default CheckoutPage;
