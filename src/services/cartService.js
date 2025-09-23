// // services/cartService.js

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// /**
//  * Get auth token from localStorage
//  */
// function getAuthToken() {
//   if (typeof window === "undefined") return null;
//   const token = localStorage.getItem("token");
//   return token ? `Bearer ${token}` : null;
// }

// /**
//  * Add product to cart (API call)
//  */
// export async function addToCartAPI(productId, { quantity, color, size }) {
//   const token = getAuthToken();
//   if (!token) throw new Error("Authentication required");

//   const response = await fetch(`${API_URL}/cart/products/${productId}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Authorization: token,
//     },
//     body: JSON.stringify({ quantity, color, size }),
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || "Failed to add to cart");
//   }

//   return response.json();
// }

// /**
//  * Update product quantity in cart
//  */
// export async function updateCartItemAPI(productId, quantity) {
//   const token = getAuthToken();
//   if (!token) throw new Error("Authentication required");

//   const response = await fetch(`${API_URL}/cart/products/${productId}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Authorization: token,
//     },
//     body: JSON.stringify({ quantity }),
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || "Failed to update quantity");
//   }

//   return response.json();
// }

// /**
//  * Remove product from cart
//  */
// export async function removeFromCartAPI(productId) {
//   const token = getAuthToken();
//   if (!token) throw new Error("Authentication required");

//   const response = await fetch(`${API_URL}/cart/products/${productId}`, {
//     method: "DELETE",
//     headers: {
//       Accept: "application/json",
//       Authorization: token,
//     },
//   });

//   if (!response.ok && response.status !== 204) {
//     const error = await response.json();
//     throw new Error(error.message || "Failed to remove item");
//   }

//   return true;
// }

// /**
//  * Get cart items
//  */
// export async function getCartAPI() {
//   const token = getAuthToken();
//   if (!token) return [];

//   try {
//     const response = await fetch(`${API_URL}/cart`, {
//       headers: {
//         Accept: "application/json",
//         Authorization: token,
//       },
//     });

//     if (!response.ok) {
//       console.error("Failed to fetch cart");
//       return [];
//     }

//     return response.json();
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     return [];
//   }
// }

// /**
//  * Checkout cart
//  */
// export async function checkoutAPI() {
//   const token = getAuthToken();
//   if (!token) throw new Error("Authentication required");

//   const response = await fetch(`${API_URL}/cart/checkout`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       Authorization: token,
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Checkout failed");
//   }

//   return data;
// }
