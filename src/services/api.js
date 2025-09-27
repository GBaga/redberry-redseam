// services/api.js

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ==============================
   Helpers
   ============================== */

/**
 * Handles API response and error checking
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} API error response
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || `Request failed with status ${response.status}`
    );
    error.errors = data.errors || {};
    throw error;
  }

  return data;
}

/**
 * Get auth token from localStorage
 * @returns {string|null} Bearer token string or null
 */
function getAuthToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : null;
}

/* ==============================
   Auth Services
   ============================== */

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - { token, user }
 */
export async function login({ email, password }) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);

  // Store token and user locally
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

/**
 * Register new user
 * @param {FormData} formData
 * @returns {Promise<Object>} - { token, user }
 */
export async function register(formData) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });

  const data = await handleResponse(response);

  // Store token and user locally
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

/* ==============================
   Product Services
   ============================== */

/**
 * Fetch paginated products with optional filters
 * @param {number} page - Page number (default: 1)
 * @param {string} sort - Sort field with optional '-' prefix for descending
 * @param {number} minPrice - Minimum price filter
 * @param {number} maxPrice - Maximum price filter
 * @returns {Promise<Object>} Products response with data and pagination
 */
export async function fetchProducts(page = 1, sort = "", minPrice, maxPrice) {
  const params = new URLSearchParams({ page: page.toString() });

  if (sort) params.append("sort", sort);
  if (minPrice !== undefined && minPrice !== null && minPrice !== "")
    params.append("filter[price_from]", minPrice.toString());
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "")
    params.append("filter[price_to]", maxPrice.toString());

  const response = await fetch(`${API_URL}/products?${params}`, {
    headers: {
      Accept: "application/json",
      ...(getAuthToken() && { Authorization: getAuthToken() }),
    },
  });

  return handleResponse(response);
}

/* ==============================
   Cart Services
   ============================== */

/**
 * Add product to cart
 */
export async function addToCart(productId, { quantity, color, size }) {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await fetch(`${API_URL}/cart/products/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ quantity, color, size }),
  });

  return handleResponse(response);
}

/**
 * Update product quantity in cart
 */
export async function updateCartItem(productId, quantity, { color, size }) {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await fetch(`${API_URL}/cart/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ quantity, color, size }),
  });

  return handleResponse(response);
}

/**
 * Remove product from cart
 */
export async function removeFromCart(productId) {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await fetch(`${API_URL}/cart/products/${productId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });

  if (response.status === 204) return true;
  return handleResponse(response);
}

/**
 * Get cart items
 */
export async function getCart() {
  const token = getAuthToken();
  if (!token) return [];

  const response = await fetch(`${API_URL}/cart`, {
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });

  if (!response.ok) return [];
  return handleResponse(response);
}

/**
 * Checkout cart
 */
export async function checkout() {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await fetch(`${API_URL}/cart/checkout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });

  return handleResponse(response);
}

export async function checkoutWithDetails(checkoutData) {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await fetch(`${API_URL}/cart/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify(checkoutData),
  });

  return handleResponse(response);
}

// services/api.js

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// // Constants
// const STORAGE_KEYS = {
//   TOKEN: "token",
//   USER: "user",
//   CART: "cart",
// };

// const HTTP_STATUS = {
//   OK: 200,
//   NO_CONTENT: 204,
//   BAD_REQUEST: 400,
//   UNAUTHORIZED: 401,
//   FORBIDDEN: 403,
//   NOT_FOUND: 404,
//   UNPROCESSABLE: 422,
//   SERVER_ERROR: 500,
// };

// const DEFAULT_HEADERS = {
//   Accept: "application/json",
//   "Content-Type": "application/json",
// };

// // Request timeout in milliseconds
// const REQUEST_TIMEOUT = 30000;

// /* ==============================
//    Error Classes
//    ============================== */

// class APIError extends Error {
//   constructor(message, status, errors = {}) {
//     super(message);
//     this.name = "APIError";
//     this.status = status;
//     this.errors = errors;
//   }
// }

// class AuthenticationError extends APIError {
//   constructor(message = "Authentication required") {
//     super(message, HTTP_STATUS.UNAUTHORIZED);
//     this.name = "AuthenticationError";
//   }
// }

// class NetworkError extends Error {
//   constructor(message = "Network request failed") {
//     super(message);
//     this.name = "NetworkError";
//   }
// }

// /* ==============================
//    Helpers
//    ============================== */

// /**
//  * Creates an AbortController with timeout
//  * @param {number} timeout - Timeout in milliseconds
//  * @returns {AbortController} Controller instance
//  */
// function createTimeoutController(timeout = REQUEST_TIMEOUT) {
//   const controller = new AbortController();
//   setTimeout(() => controller.abort(), timeout);
//   return controller;
// }

// /**
//  * Handles API response and error checking
//  * @param {Response} response - Fetch response object
//  * @returns {Promise<any>} Parsed JSON response
//  * @throws {APIError} API error response
//  */
// async function handleResponse(response) {
//   // Handle no content responses
//   if (response.status === HTTP_STATUS.NO_CONTENT) {
//     return { success: true };
//   }

//   let data;
//   try {
//     const text = await response.text();
//     data = text ? JSON.parse(text) : {};
//   } catch (error) {
//     console.error("Failed to parse response:", error);
//     data = {};
//   }

//   if (!response.ok) {
//     // Handle authentication errors
//     if (response.status === HTTP_STATUS.UNAUTHORIZED) {
//       clearAuthData();
//       throw new AuthenticationError(data.message || "Authentication failed");
//     }

//     throw new APIError(
//       data.message || `Request failed with status ${response.status}`,
//       response.status,
//       data.errors || {}
//     );
//   }

//   return data;
// }

// /**
//  * Get auth token from localStorage
//  * @returns {string|null} Bearer token string or null
//  */
// function getAuthToken() {
//   if (typeof window === "undefined") return null;

//   try {
//     const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
//     return token ? `Bearer ${token}` : null;
//   } catch (error) {
//     console.error("Failed to get auth token:", error);
//     return null;
//   }
// }

// /**
//  * Store authentication data
//  * @param {string} token - Auth token
//  * @param {Object} user - User object
//  */
// function storeAuthData(token, user) {
//   if (typeof window === "undefined") return;

//   try {
//     localStorage.setItem(STORAGE_KEYS.TOKEN, token);
//     localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
//   } catch (error) {
//     console.error("Failed to store auth data:", error);
//   }
// }

// /**
//  * Clear authentication data
//  */
// function clearAuthData() {
//   if (typeof window === "undefined") return;

//   try {
//     localStorage.removeItem(STORAGE_KEYS.TOKEN);
//     localStorage.removeItem(STORAGE_KEYS.USER);
//     localStorage.removeItem(STORAGE_KEYS.CART);
//   } catch (error) {
//     console.error("Failed to clear auth data:", error);
//   }
// }

// /**
//  * Make authenticated request
//  * @param {string} url - Request URL
//  * @param {Object} options - Fetch options
//  * @returns {Promise<any>} Response data
//  */
// async function authenticatedRequest(url, options = {}) {
//   const token = getAuthToken();
//   if (!token) throw new AuthenticationError();

//   const controller = createTimeoutController();

//   try {
//     const response = await fetch(url, {
//       ...options,
//       signal: controller.signal,
//       headers: {
//         ...DEFAULT_HEADERS,
//         ...options.headers,
//         Authorization: token,
//       },
//     });

//     return handleResponse(response);
//   } catch (error) {
//     if (error.name === "AbortError") {
//       throw new NetworkError("Request timeout");
//     }
//     throw error;
//   }
// }

// /**
//  * Make public request
//  * @param {string} url - Request URL
//  * @param {Object} options - Fetch options
//  * @returns {Promise<any>} Response data
//  */
// async function publicRequest(url, options = {}) {
//   const controller = createTimeoutController();

//   try {
//     const response = await fetch(url, {
//       ...options,
//       signal: controller.signal,
//       headers: {
//         ...DEFAULT_HEADERS,
//         ...options.headers,
//       },
//     });

//     return handleResponse(response);
//   } catch (error) {
//     if (error.name === "AbortError") {
//       throw new NetworkError("Request timeout");
//     }
//     throw error;
//   }
// }

// /* ==============================
//    Auth Services
//    ============================== */

// /**
//  * Login user
//  * @param {Object} credentials - { email, password }
//  * @returns {Promise<Object>} - { token, user }
//  */
// export async function login({ email, password }) {
//   if (!email || !password) {
//     throw new Error("Email and password are required");
//   }

//   const data = await publicRequest(`${API_URL}/login`, {
//     method: "POST",
//     body: JSON.stringify({ email, password }),
//   });

//   storeAuthData(data.token, data.user);
//   return data;
// }

// /**
//  * Register new user
//  * @param {FormData} formData
//  * @returns {Promise<Object>} - { token, user }
//  */
// export async function register(formData) {
//   if (!formData || !(formData instanceof FormData)) {
//     throw new Error("Invalid form data");
//   }

//   const controller = createTimeoutController();

//   try {
//     const response = await fetch(`${API_URL}/register`, {
//       method: "POST",
//       signal: controller.signal,
//       headers: { Accept: "application/json" },
//       body: formData,
//     });

//     const data = await handleResponse(response);
//     storeAuthData(data.token, data.user);
//     return data;
//   } catch (error) {
//     if (error.name === "AbortError") {
//       throw new NetworkError("Request timeout");
//     }
//     throw error;
//   }
// }

// /**
//  * Logout user
//  */
// export function logout() {
//   clearAuthData();
//   if (typeof window !== "undefined") {
//     window.dispatchEvent(new Event("logout"));
//   }
// }

// /* ==============================
//    Product Services
//    ============================== */

// /**
//  * Fetch paginated products with optional filters
//  * @param {Object} options - Filter options
//  * @returns {Promise<Object>} Products response with data and pagination
//  */
// export async function fetchProducts({
//   page = 1,
//   sort = "",
//   minPrice = null,
//   maxPrice = null,
//   limit = 20,
// } = {}) {
//   const params = new URLSearchParams();

//   params.append("page", page.toString());
//   if (limit) params.append("limit", limit.toString());
//   if (sort) params.append("sort", sort);
//   if (minPrice !== null && minPrice !== "") {
//     params.append("filter[price_from]", minPrice.toString());
//   }
//   if (maxPrice !== null && maxPrice !== "") {
//     params.append("filter[price_to]", maxPrice.toString());
//   }

//   const token = getAuthToken();
//   const headers = token
//     ? { ...DEFAULT_HEADERS, Authorization: token }
//     : DEFAULT_HEADERS;

//   const controller = createTimeoutController();

//   try {
//     const response = await fetch(`${API_URL}/products?${params}`, {
//       signal: controller.signal,
//       headers,
//     });

//     return handleResponse(response);
//   } catch (error) {
//     if (error.name === "AbortError") {
//       throw new NetworkError("Request timeout");
//     }
//     throw error;
//   }
// }

// /**
//  * Fetch single product by ID
//  * @param {string|number} productId - Product ID
//  * @returns {Promise<Object>} Product data
//  */
// export async function fetchProduct(productId) {
//   if (!productId) {
//     throw new Error("Product ID is required");
//   }

//   const token = getAuthToken();
//   const headers = token
//     ? { ...DEFAULT_HEADERS, Authorization: token }
//     : DEFAULT_HEADERS;

//   const controller = createTimeoutController();

//   try {
//     const response = await fetch(`${API_URL}/products/${productId}`, {
//       signal: controller.signal,
//       headers,
//     });

//     return handleResponse(response);
//   } catch (error) {
//     if (error.name === "AbortError") {
//       throw new NetworkError("Request timeout");
//     }
//     throw error;
//   }
// }

// /* ==============================
//    Cart Services
//    ============================== */

// /**
//  * Add product to cart
//  * @param {string|number} productId - Product ID
//  * @param {Object} options - Cart options
//  * @returns {Promise<Object>} Cart response
//  */
// export async function addToCart(productId, { quantity = 1, color, size } = {}) {
//   if (!productId) {
//     throw new Error("Product ID is required");
//   }

//   return authenticatedRequest(`${API_URL}/cart/products/${productId}`, {
//     method: "POST",
//     body: JSON.stringify({ quantity, color, size }),
//   });
// }

// /**
//  * Update product quantity in cart
//  * @param {string|number} productId - Product ID
//  * @param {number} quantity - New quantity
//  * @returns {Promise<Object>} Update response
//  */
// export async function updateCartItem(productId, quantity) {
//   if (!productId) {
//     throw new Error("Product ID is required");
//   }

//   if (quantity < 1) {
//     throw new Error("Quantity must be at least 1");
//   }

//   return authenticatedRequest(`${API_URL}/cart/products/${productId}`, {
//     method: "PATCH",
//     body: JSON.stringify({ quantity }),
//   });
// }

// /**
//  * Remove product from cart
//  * @param {string|number} productId - Product ID
//  * @returns {Promise<boolean>} Success status
//  */
// export async function removeFromCart(productId) {
//   if (!productId) {
//     throw new Error("Product ID is required");
//   }

//   const result = await authenticatedRequest(
//     `${API_URL}/cart/products/${productId}`,
//     {
//       method: "DELETE",
//     }
//   );

//   return result.success || true;
// }

// /**
//  * Get cart items
//  * @returns {Promise<Array>} Cart items array
//  */
// export async function getCart() {
//   try {
//     return await authenticatedRequest(`${API_URL}/cart`);
//   } catch (error) {
//     // Return empty cart for auth errors
//     if (error instanceof AuthenticationError) {
//       return [];
//     }
//     throw error;
//   }
// }

// /**
//  * Clear entire cart
//  * @returns {Promise<boolean>} Success status
//  */
// export async function clearCart() {
//   try {
//     const result = await authenticatedRequest(`${API_URL}/cart`, {
//       method: "DELETE",
//     });
//     return result.success || true;
//   } catch (error) {
//     console.error("Failed to clear cart:", error);
//     return false;
//   }
// }

// /**
//  * Checkout cart with details
//  * @param {Object} checkoutData - Checkout information
//  * @returns {Promise<Object>} Checkout response
//  */
// export async function checkout(checkoutData = {}) {
//   // Validate required fields if provided
//   if (checkoutData && Object.keys(checkoutData).length > 0) {
//     const required = ["name", "surname", "email", "zip_code", "address"];
//     const missing = required.filter((field) => !checkoutData[field]?.trim());

//     if (missing.length > 0) {
//       throw new Error(`Missing required fields: ${missing.join(", ")}`);
//     }
//   }

//   const body =
//     Object.keys(checkoutData).length > 0
//       ? JSON.stringify(checkoutData)
//       : undefined;

//   return authenticatedRequest(`${API_URL}/cart/checkout`, {
//     method: "POST",
//     ...(body && { body }),
//   });
// }

// // Alias for backward compatibility
// export const checkoutWithDetails = checkout;

// /* ==============================
//    User Services
//    ============================== */

// /**
//  * Get current user profile
//  * @returns {Promise<Object>} User data
//  */
// export async function getUserProfile() {
//   return authenticatedRequest(`${API_URL}/user`);
// }

// /**
//  * Update user profile
//  * @param {Object} userData - User data to update
//  * @returns {Promise<Object>} Updated user data
//  */
// export async function updateUserProfile(userData) {
//   return authenticatedRequest(`${API_URL}/user`, {
//     method: "PATCH",
//     body: JSON.stringify(userData),
//   });
// }

// /* ==============================
//    Export utilities
//    ============================== */

// export const apiErrors = {
//   APIError,
//   AuthenticationError,
//   NetworkError,
// };

// export const httpStatus = HTTP_STATUS;
