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
export async function updateCartItem(productId, quantity) {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await fetch(`${API_URL}/cart/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ quantity }),
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
