"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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

// Constants
const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  CART: "cart",
};

const ROUTES = {
  LOGIN: "/login",
  PROFILE: "/profile",
  ORDER_CONFIRMATION: "/order-confirmation",
};

export default function MainLayout({ children }) {
  // Combined state for better performance
  const [state, setState] = useState({
    cartItems: [],
    isCartOpen: false,
    userAvatar: "/images/placeholder.png",
    isLoading: false,
    currentUserId: null,
    isLoggedIn: false,
  });

  // Memoized cart count
  const cartItemCount = useMemo(
    () =>
      state.cartItems.reduce((total, item) => total + (item.quantity || 0), 0),
    [state.cartItems]
  );

  // Update state helper
  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Get auth data
  const getAuthData = useCallback(() => {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER);

    if (!token || !userData) return null;

    try {
      return { token, user: JSON.parse(userData) };
    } catch {
      return null;
    }
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    if (typeof window === "undefined") return;

    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));

    updateState({
      isLoggedIn: false,
      currentUserId: null,
      cartItems: [],
      userAvatar: "/images/placeholder.png",
      isCartOpen: false,
    });
  }, [updateState]);

  // Handle logout
  const handleLogout = useCallback(() => {
    clearAllData();
    window.location.href = ROUTES.LOGIN;
  }, [clearAllData]);

  // Load cart from API
  const loadCartFromAPI = useCallback(async () => {
    try {
      const cartData = await getCart();
      return Array.isArray(cartData) ? cartData : [];
    } catch (error) {
      console.error("Error loading cart:", error);

      if (error.message?.includes("Authentication failed")) {
        handleLogout();
        return [];
      }

      // Fallback to localStorage
      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }

      return [];
    }
  }, [handleLogout]);

  // Load cart (API or localStorage)
  const loadCart = useCallback(async () => {
    const authData = getAuthData();

    if (authData?.token) {
      // Logged in - fetch from API
      const cartData = await loadCartFromAPI();
      updateState({ cartItems: cartData });
    } else {
      // Guest - check localStorage
      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          updateState({ cartItems: Array.isArray(parsed) ? parsed : [] });
        } catch {
          updateState({ cartItems: [] });
        }
      }
    }
  }, [getAuthData, loadCartFromAPI, updateState]);

  // Initialize auth and load user data
  const initializeAuth = useCallback(async () => {
    const authData = getAuthData();

    if (!authData) {
      clearAllData();
      return;
    }

    const { user } = authData;

    // Check if user changed
    if (state.currentUserId && state.currentUserId !== user.id) {
      updateState({ cartItems: [] });
      localStorage.removeItem(STORAGE_KEYS.CART);
    }

    updateState({
      currentUserId: user.id,
      isLoggedIn: true,
      userAvatar:
        user.avatar || user.profile_photo || "/images/placeholder.png",
    });

    await loadCart();
  }, [getAuthData, clearAllData, loadCart, updateState, state.currentUserId]);

  // Initial load
  useEffect(() => {
    initializeAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save cart to localStorage for guests
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !state.isLoggedIn &&
      state.cartItems.length > 0
    ) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.cartItems));
    }
  }, [state.cartItems, state.isLoggedIn]);

  // Listen for storage changes and custom events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.TOKEN || e.key === STORAGE_KEYS.USER) {
        initializeAuth();
      }
    };

    const handleClearCart = () => {
      updateState({ cartItems: [] });
      localStorage.removeItem(STORAGE_KEYS.CART);
    };

    // NEW: Listen for cart update events
    const handleCartUpdate = (e) => {
      const { cartItems: newCartItems } = e.detail || {};
      if (Array.isArray(newCartItems)) {
        updateState({ cartItems: newCartItems });
      }
    };

    // NEW: Listen for cart refresh events from product detail pages
    const handleCartRefresh = async () => {
      // Reload cart data from API/localStorage
      await loadCart();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("clearCart", handleClearCart);
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("cartRefreshNeeded", handleCartRefresh);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("clearCart", handleClearCart);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("cartRefreshNeeded", handleCartRefresh);
    };
  }, [initializeAuth, updateState, loadCart]);

  // Handle cart update from Header
  const handleCartUpdate = useCallback(
    (newCartItems) => {
      updateState({
        cartItems: Array.isArray(newCartItems) ? newCartItems : [],
      });
    },
    [updateState]
  );

  // Add to cart
  const handleAddToCart = useCallback(
    async (product) => {
      const authData = getAuthData();

      // Normalize product data
      const normalizeProduct = (item, originalProduct) => ({
        ...item,
        total_price: (item.price || 0) * (item.quantity || 0),
        cover_image:
          item.cover_image ||
          originalProduct.image ||
          originalProduct.cover_image,
        brand: item.brand || {
          id: 1,
          name: originalProduct.brand || "Unknown",
        },
      });

      // Local cart update for guests
      if (!authData?.token) {
        updateState((prev) => {
          const cartItems = [...prev.cartItems];
          const existingIndex = cartItems.findIndex(
            (item) =>
              item.id === product.id &&
              item.color === product.color &&
              item.size === product.size
          );

          if (existingIndex !== -1) {
            cartItems[existingIndex].quantity += product.quantity;
            cartItems[existingIndex].total_price =
              cartItems[existingIndex].price *
              cartItems[existingIndex].quantity;
          } else {
            cartItems.push(normalizeProduct(product, product));
          }

          // Dispatch custom event for other components
          window.dispatchEvent(
            new CustomEvent("cartUpdated", {
              detail: { cartItems },
            })
          );

          return { ...prev, cartItems, isCartOpen: true };
        });
        return;
      }

      // API call for logged-in users
      updateState({ isLoading: true });

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
          color: response.color || product.color,
          size: response.size || product.size,
          ...normalizeProduct(response, product),
        };

        updateState((prev) => {
          const cartItems = [...prev.cartItems];
          const existingIndex = cartItems.findIndex(
            (item) =>
              item.id === normalizedItem.id &&
              item.color === normalizedItem.color &&
              item.size === normalizedItem.size
          );

          if (existingIndex !== -1) {
            cartItems[existingIndex] = normalizedItem;
          } else {
            cartItems.push(normalizedItem);
          }

          // Dispatch custom event for other components
          window.dispatchEvent(
            new CustomEvent("cartUpdated", {
              detail: { cartItems },
            })
          );

          return { ...prev, cartItems, isCartOpen: true, isLoading: false };
        });
      } catch (error) {
        console.error("Error adding to cart:", error);

        if (error.message?.includes("Authentication failed")) {
          handleLogout();
        } else {
          alert("Failed to add item to cart. Please try again.");
        }

        updateState({ isLoading: false });
      }
    },
    [getAuthData, updateState, handleLogout]
  );

  // Update quantity
  const handleUpdateQuantity = useCallback(
    async (productId, newQuantity) => {
      // Optimistic update
      updateState((prev) => {
        const updatedCartItems = prev.cartItems.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: newQuantity,
                total_price: item.price * newQuantity,
              }
            : item
        );

        // Dispatch custom event for other components
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: { cartItems: updatedCartItems },
          })
        );

        return {
          ...prev,
          cartItems: updatedCartItems,
        };
      });

      const authData = getAuthData();
      if (authData?.token) {
        try {
          await updateCartItem(productId, newQuantity);
        } catch (error) {
          console.error("Failed to update quantity:", error);
          if (error.message?.includes("Authentication failed")) {
            handleLogout();
          }
          // Revert on failure
          await loadCart();
        }
      }
    },
    [getAuthData, updateState, handleLogout, loadCart]
  );

  // Remove item
  const handleRemoveItem = useCallback(
    async (productId) => {
      // Optimistic update
      updateState((prev) => {
        const updatedCartItems = prev.cartItems.filter(
          (item) => item.id !== productId
        );

        // Dispatch custom event for other components
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: { cartItems: updatedCartItems },
          })
        );

        return {
          ...prev,
          cartItems: updatedCartItems,
        };
      });

      const authData = getAuthData();
      if (authData?.token) {
        try {
          await removeFromCart(productId);
        } catch (error) {
          console.error("Failed to remove item:", error);
          if (error.message?.includes("Authentication failed")) {
            handleLogout();
          }
          // Revert on failure
          await loadCart();
        }
      }
    },
    [getAuthData, updateState, handleLogout, loadCart]
  );

  // Checkout
  const handleCheckout = useCallback(async () => {
    const authData = getAuthData();

    if (!authData?.token) {
      window.location.href = ROUTES.LOGIN;
      return;
    }

    updateState({ isLoading: true });

    try {
      await checkout();

      // Clear cart after successful checkout
      const emptyCart = [];
      updateState({
        cartItems: emptyCart,
        isCartOpen: false,
        isLoading: false,
      });

      // Dispatch custom event for other components
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { cartItems: emptyCart },
        })
      );

      localStorage.removeItem(STORAGE_KEYS.CART);
      window.location.href = ROUTES.ORDER_CONFIRMATION;
    } catch (error) {
      console.error("Checkout failed:", error);

      if (error.message?.includes("Authentication failed")) {
        handleLogout();
      } else {
        alert("Checkout failed. Please try again.");
      }

      updateState({ isLoading: false });
    }
  }, [getAuthData, updateState, handleLogout]);

  // Handle profile click
  const handleProfileClick = useCallback(
    (logoutFn) => {
      if (logoutFn) {
        logoutFn();
        return;
      }

      const authData = getAuthData();
      window.location.href = authData?.token ? ROUTES.PROFILE : ROUTES.LOGIN;
    },
    [getAuthData]
  );

  // Clone children with props
  const childrenWithProps = useMemo(
    () =>
      React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onAddToCart: handleAddToCart,
            // Pass cart update methods to children
            onUpdateCartQuantity: handleUpdateQuantity,
            onRemoveFromCart: handleRemoveItem,
          });
        }
        return child;
      }),
    [children, handleAddToCart, handleUpdateQuantity, handleRemoveItem]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        userAvatar={state.userAvatar}
        cartItemCount={cartItemCount}
        onCartClick={() => updateState({ isCartOpen: true })}
        onProfileClick={handleProfileClick}
        onCartUpdate={handleCartUpdate}
        currentUserId={state.currentUserId} // Pass current user ID to force re-render
      />

      <main className="flex-1 pt-20">{childrenWithProps}</main>

      <Footer />

      <CartSideBar
        isOpen={state.isCartOpen}
        onClose={() => updateState({ isCartOpen: false })}
        cartItems={state.cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        isLoading={state.isLoading}
      />

      {state.isLoading && <LoadingOverlay />}
    </div>
  );
}

// Loading overlay component
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-[60]">
    <div className="bg-white rounded-lg p-6 shadow-xl">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin" />
    </div>
  </div>
);
