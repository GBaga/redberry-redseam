"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import CartSideBar from "@/components/CartSideBar";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkout,
} from "@/services/api";

export default function MainLayout({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState("/images/placeholder.png");
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from API on mount
  useEffect(() => {
    loadCart();
    loadUserProfile();
  }, []);

  // Load user profile
  const loadUserProfile = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.avatar || user.profile_photo) {
          setUserAvatar(user.avatar || user.profile_photo);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    }
  };

  // Load cart from API
  const loadCart = async () => {
    try {
      const cartData = await getCart();
      setCartItems(cartData);
    } catch (error) {
      console.error("Error loading cart:", error);
      // Fallback to local storage
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Error parsing saved cart:", e);
        }
      }
    }
  };

  // Save cart to localStorage as backup
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Add item to cart with API integration
  const addToCart = useCallback(async (product) => {
    const token = localStorage.getItem("token");

    // If not logged in, use local storage only
    if (!token) {
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) =>
            item.id === product.id &&
            item.color === product.color &&
            item.size === product.size
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += product.quantity;
          updatedItems[existingItemIndex].total_price =
            updatedItems[existingItemIndex].price *
            updatedItems[existingItemIndex].quantity;
          return updatedItems;
        } else {
          const newItem = {
            ...product,
            total_price: product.price * product.quantity,
            cover_image: product.image || product.cover_image,
            brand: {
              id: 1,
              name: product.brand || "Unknown",
              image: product.brandLogo || null,
            },
          };
          return [...prevItems, newItem];
        }
      });
      setIsCartOpen(true);
      return;
    }

    // If logged in, use API
    setIsLoading(true);
    try {
      const response = await addToCart(product.id, {
        quantity: product.quantity,
        color: product.color,
        size: product.size,
      });

      // Update local state with API response
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) =>
            item.id === product.id &&
            item.color === product.color &&
            item.size === product.size
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = response;
          return updatedItems;
        } else {
          return [...prevItems, response];
        }
      });

      setIsCartOpen(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update item quantity with API
  const handleUpdateQuantity = useCallback(async (productId, quantity) => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Local update only
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity,
                total_price: item.price * quantity,
              }
            : item
        )
      );
      return;
    }

    try {
      const response = await updateCartItem(productId, quantity);
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === productId ? response : item))
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  }, []);

  // Remove item from cart with API
  const handleRemoveItem = useCallback(async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Local remove only
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
      return;
    }

    try {
      await removeFromCart(productId);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    } catch (error) {
      console.error("Error removing item:", error);
      throw error;
    }
  }, []);

  // Handle checkout with API
  const handleCheckout = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to checkout");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await checkout();
      alert(response.message || "Checkout successful!");
      setCartItems([]);
      localStorage.removeItem("cart");
      setIsCartOpen(false);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(error.message || "Checkout failed. Please try again.");
      throw error;
    }
  }, []);

  // Handle profile click
  const handleProfileClick = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    } else {
      // You can implement a profile dropdown or navigate to profile page
      window.location.href = "/profile";
    }
  }, []);

  // Calculate total cart items count
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Clone children and pass props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { onAddToCart: addToCart });
    }
    return child;
  });

  return (
    <>
      <Header
        userAvatar={userAvatar}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        onProfileClick={handleProfileClick}
      />

      {/* Main content with padding for fixed header */}
      <main className="pt-20">{childrenWithProps}</main>

      <CartSideBar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-4">
            <div className="w-8 h-8 border-3 border-gray-300 border-t-red-500 rounded-full animate-spin" />
          </div>
        </div>
      )}
    </>
  );
}
