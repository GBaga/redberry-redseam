"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CartSideBar from "@/components/CartSideBar";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem,
  removeFromCart,
  checkout,
} from "@/services/api";

export default function MainLayout({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState("/images/placeholder.png");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status and load user data
  useEffect(() => {
    checkAuthAndLoadUserData();
  }, []);

  const checkAuthAndLoadUserData = () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const previousUserId = currentUserId;

        // If user changed, clear cart first
        if (previousUserId && previousUserId !== user.id) {
          setCartItems([]);
          localStorage.removeItem("cart");
        }

        setCurrentUserId(user.id);
        setIsLoggedIn(true);
        setUserAvatar(
          user.avatar || user.profile_photo || "/images/placeholder.png"
        );

        // Load cart for current user
        loadCart();
      } catch (error) {
        console.error("Error parsing user data:", error);
        handleLogout();
      }
    } else {
      // No authentication - clear everything
      setIsLoggedIn(false);
      setCurrentUserId(null);
      setCartItems([]);
      setUserAvatar("/images/placeholder.png");
      localStorage.removeItem("cart");
    }
  };

  // Load cart from API or localStorage fallback
  const loadCart = async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

    if (!token) {
      // No token - check localStorage for guest cart
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
        } catch {
          setCartItems([]);
        }
      }
      return;
    }

    // Logged in - fetch from API
    try {
      const cartData = await getCart();
      setCartItems(Array.isArray(cartData) ? cartData : []);
    } catch (error) {
      console.error("Error loading cart:", error);

      // If auth error, clear everything
      if (error.message.includes("Authentication failed")) {
        handleLogout();
        return;
      }

      // For other errors, fall back to localStorage
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
        } catch {
          setCartItems([]);
        }
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");

    setIsLoggedIn(false);
    setCurrentUserId(null);
    setCartItems([]);
    setUserAvatar("/images/placeholder.png");
    setIsCartOpen(false);
  };

  // Handle cart updates from Header component
  const handleCartUpdate = useCallback((newCartItems) => {
    setCartItems(Array.isArray(newCartItems) ? newCartItems : []);
  }, []);

  // Listen for auth changes and clear cart events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        checkAuthAndLoadUserData();
      }
    };

    const handleClearCart = () => {
      setCartItems([]);
      localStorage.removeItem("cart");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("clearCart", handleClearCart);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("clearCart", handleClearCart);
      };
    }
  }, []);

  // Save cart to localStorage (only for guest users)
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoggedIn) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);

  // Add item to cart
  const handleAddToCart = useCallback(async (product) => {
    const token = localStorage.getItem("token");

    // Local only if not logged in
    if (!token) {
      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.id === product.id &&
            item.color === product.color &&
            item.size === product.size
        );
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += product.quantity;
          updated[existingIndex].total_price =
            updated[existingIndex].price * updated[existingIndex].quantity;
          return updated;
        } else {
          return [
            ...prev,
            {
              ...product,
              total_price: product.price * product.quantity,
              cover_image: product.image || product.cover_image,
              brand: {
                id: 1,
                name: product.brand || "Unknown",
                image: product.brandLogo || null,
              },
            },
          ];
        }
      });
      setIsCartOpen(true);
      return;
    }

    // Logged-in: API
    setIsLoading(true);
    try {
      const response = await apiAddToCart(product.id, {
        quantity: product.quantity,
        color: product.color,
        size: product.size,
      });

      const normalizedItem = {
        id: response.id,
        name: response.name,
        price: response.price,
        quantity: response.quantity,
        total_price: response.price * response.quantity,
        cover_image:
          response.cover_image || product.cover_image || product.image,
        color: response.color || product.color,
        size: response.size || product.size,
        brand: response.brand || { id: 1, name: product.brand || "Unknown" },
      };

      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.id === normalizedItem.id &&
            item.color === normalizedItem.color &&
            item.size === normalizedItem.size
        );
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = normalizedItem;
          return updated;
        } else {
          return [...prev, normalizedItem];
        }
      });

      setIsCartOpen(true);
    } catch (error) {
      console.error("Error adding to cart:", error);

      if (error.message.includes("Authentication failed")) {
        handleLogout();
        return;
      }

      alert("Failed to add to cart.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update quantity
  const handleUpdateQuantity = useCallback(
    async (productId, newQuantity, color, size) => {
      // Optimistic update
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId && item.color === color && item.size === size
            ? {
                ...item,
                quantity: newQuantity,
                total_price: item.price * newQuantity,
              }
            : item
        )
      );

      const token = localStorage.getItem("token");
      if (token) {
        try {
          await updateCartItem(productId, newQuantity);
        } catch (error) {
          console.error("API quantity update failed:", error);

          if (error.message.includes("Authentication failed")) {
            handleLogout();
          }
        }
      }
    },
    []
  );

  const handleRemoveItem = useCallback(async (productId, color, size) => {
    // Optimistic remove
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.id === productId && item.color === color && item.size === size)
      )
    );

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await removeFromCart(productId);
      } catch (error) {
        console.error("API remove failed:", error);

        if (error.message.includes("Authentication failed")) {
          handleLogout();
        }
      }
    }
  }, []);

  // Checkout
  const handleCheckout = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setIsLoading(true);
      const response = await checkout();
      setCartItems([]);
      setIsCartOpen(false);
      localStorage.removeItem("cart");
      window.location.href = "/order-confirmation";
    } catch (error) {
      console.error("Checkout failed:", error);

      if (error.message.includes("Authentication failed")) {
        handleLogout();
        return;
      }

      alert("Checkout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleProfileClick = useCallback((logoutFn) => {
    if (logoutFn) {
      // This is a logout request
      logoutFn();
      return;
    }

    // Default profile behavior
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    } else {
      window.location.href = "/profile";
    }
  }, []);

  const cartItemCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child))
      return React.cloneElement(child, { onAddToCart: handleAddToCart });
    return child;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        userAvatar={userAvatar}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        onProfileClick={handleProfileClick}
        onCartUpdate={handleCartUpdate}
      />

      <main className="flex-1 pt-20">{childrenWithProps}</main>

      <Footer />

      <CartSideBar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        isLoading={isLoading}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-4">
            <div className="w-8 h-8 border-3 border-gray-300 border-t-red-500 rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}
