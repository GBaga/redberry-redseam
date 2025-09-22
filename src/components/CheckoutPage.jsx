"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCart, updateCartItem, removeFromCart } from "@/services/api";
import SuccessModal from "@/components/SuccessModal";

const CheckoutPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    zip_code: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  const deliveryFee = 5;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setMounted(true);
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    if (typeof window === "undefined") return;

    try {
      // Load cart from API first, fallback to localStorage
      const apiCart = await getCart();
      if (apiCart && apiCart.length > 0) {
        setCartItems(apiCart);
        // Sync with localStorage
        localStorage.setItem("cartItems", JSON.stringify(apiCart));
      } else {
        // Fallback to localStorage
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }

      // Load user data
      await loadUserData();
    } catch (error) {
      console.error("Error loading initial data:", error);
      // Fallback to localStorage on error
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  };

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/user`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.email) {
          setFormData((prev) => ({ ...prev, email: userData.email }));
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + deliveryFee;

  const updateQuantity = async (itemId, change) => {
    if (!mounted) return;

    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);

    try {
      // Update via API if authenticated
      const token = localStorage.getItem("token");
      if (token) {
        await updateCartItem(itemId, newQuantity);
      }

      // Update local state
      const updatedItems = cartItems.map((cartItem) => {
        if (cartItem.id === itemId) {
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      });

      setCartItems(updatedItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity. Please try again.");
    }
  };

  const removeItem = async (itemId) => {
    if (!mounted) return;

    try {
      // Remove via API if authenticated
      const token = localStorage.getItem("token");
      if (token) {
        await removeFromCart(itemId);
      }

      // Update local state
      const updatedItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.surname?.trim()) {
      newErrors.surname = "Surname is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.zip_code?.trim()) {
      newErrors.zip_code = "Zip code is required";
    }

    if (!formData.address?.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    // Validate form first
    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      return;
    }

    // Check if cart has items
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to continue with checkout");
        router.push("/login");
        return;
      }

      // Prepare checkout data
      const checkoutData = {
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        email: formData.email.trim(),
        zip_code: formData.zip_code.trim(),
        address: formData.address.trim(),
      };

      console.log("Sending checkout data:", checkoutData);

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
      console.log("Response:", response.status, responseData);

      if (response.ok) {
        // Success - show modal and clear cart
        setShowModal(true);
        localStorage.removeItem("cartItems");
        setCartItems([]);

        // Clear form
        setFormData({
          name: "",
          surname: "",
          email: "",
          zip_code: "",
          address: "",
        });
      } else {
        // Handle validation errors from server
        if (response.status === 422 && responseData.errors) {
          const serverErrors = {};
          Object.keys(responseData.errors).forEach((key) => {
            serverErrors[key] = responseData.errors[key][0];
          });
          setErrors(serverErrors);
          console.log("Server validation errors:", serverErrors);
        } else if (response.status === 401) {
          alert("Your session has expired. Please login again.");
          router.push("/login");
        } else {
          alert(responseData.message || "Checkout failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push("/");
  };

  // Icon Components
  const MinusIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 8h10"
        stroke="#E1DFE1"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

  const PlusIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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

  // Show loading state during SSR/initial hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-[100px] py-8 lg:py-[60px]">
          <h1 className="text-3xl lg:text-[42px] font-semibold text-gray-900 mb-8 lg:mb-[42px]">
            Checkout
          </h1>
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-gray-300 border-t-[#FF4000] rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-[100px] py-8 lg:py-[60px]">
        <h1 className="text-3xl lg:text-[42px] font-semibold text-gray-900 mb-8 lg:mb-[42px]">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[131px]">
          {/* Form Section */}
          <div className="flex-1 lg:max-w-[1129px]">
            <div className="bg-[#F8F6F7] rounded-2xl p-6 lg:p-[47px]">
              <h2 className="text-xl lg:text-[22px] font-medium text-gray-700 mb-6 lg:mb-[37px]">
                Order details
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCheckout();
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-[23px]">
                  <div>
                    <div
                      className={`bg-white border rounded-lg px-3 h-[42px] flex items-center ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        className="w-full outline-none text-sm text-gray-900 placeholder-gray-600"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <div
                      className={`bg-white border rounded-lg px-3 h-[42px] flex items-center ${
                        errors.surname ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                        placeholder="Surname"
                        className="w-full outline-none text-sm text-gray-900 placeholder-gray-600"
                      />
                    </div>
                    {errors.surname && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.surname}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 lg:mt-[23px]">
                  <div
                    className={`bg-white border rounded-lg px-3 h-[42px] flex items-center gap-2 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <span className="text-gray-600">
                      <EnvelopeIcon />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="w-full outline-none text-sm text-gray-900 placeholder-gray-600"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-[23px] mt-4 lg:mt-[23px]">
                  <div>
                    <div
                      className={`bg-white border rounded-lg px-3 h-[42px] flex items-center ${
                        errors.zip_code ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Address"
                        className="w-full outline-none text-sm text-gray-900 placeholder-gray-600"
                      />
                    </div>
                    {errors.zip_code && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.zip_code}
                      </p>
                    )}
                  </div>

                  <div>
                    <div
                      className={`bg-white border rounded-lg px-3 h-[42px] flex items-center ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <input
                        type="text"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleInputChange}
                        placeholder="Zip Code"
                        className="w-full outline-none text-sm text-gray-900 placeholder-gray-600"
                      />
                    </div>

                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="w-full lg:w-[460px] flex flex-col gap-[81px]">
            {/* Cart Items Container */}
            <div className="flex flex-col gap-[36px]">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <div
                    key={`${item.id}-${item.color}-${item.size}-${index}`}
                    className="flex gap-[17px]"
                  >
                    {/* Product Image */}
                    <div className="w-[100px] h-[134px] bg-gray-100 border border-[#E1DFE1] rounded-[10px] overflow-hidden flex-shrink-0">
                      {item.cover_image || item.image ? (
                        <Image
                          src={item.cover_image || item.image}
                          alt={item.name}
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
                      {/* Name and Price Row */}
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

                      {/* Quantity and Remove Row */}
                      <div className="flex justify-between items-center gap-[13px]">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[#E1DFE1] rounded-[22px] px-[8px] py-[4px] gap-[2px] w-[70px] h-[26px]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1 || isLoading}
                            className="w-[16px] h-[16px] flex items-center justify-center disabled:opacity-50"
                          >
                            <MinusIcon />
                          </button>
                          <span className="text-[12px] font-normal text-[#3E424A] leading-[18px] w-[18px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={isLoading}
                            className="w-[16px] h-[16px] flex items-center justify-center"
                          >
                            <PlusIcon />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={isLoading}
                          className="text-[12px] font-normal text-[#3E424A] leading-[18px] opacity-80 hover:opacity-100 disabled:opacity-50 w-[49px] text-right"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyCart />
              )}
            </div>

            {/* Summary and Checkout Button */}
            {cartItems.length > 0 && (
              <div className="flex flex-col gap-[16px]">
                {/* Price Summary */}
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
                      $ {deliveryFee}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[20px] font-medium text-[#10151F] leading-[30px]">
                      Total
                    </span>
                    <span className="text-[20px] font-medium text-[#10151F] leading-[30px]">
                      ${total.toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isLoading || cartItems.length === 0}
                  className="w-full h-[59px] bg-[#FF4000] hover:bg-[#E63600] disabled:bg-gray-300 text-white font-medium text-[18px] leading-[27px] py-[16px] px-[60px] rounded-[10px] transition-colors flex items-center justify-center gap-[10px]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Checkout"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {mounted && (
        <SuccessModal
          isOpen={showModal}
          onClose={handleModalClose}
          title="Congrats!"
          message="Your order is placed successfully!"
          buttonText="Continue Shopping"
        />
      )}
    </div>
  );
};

export default CheckoutPage;
