// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// /**
//  * Handles API response and error checking
//  * @param {Response} response - Fetch response object
//  * @returns {Promise<any>} Parsed JSON response
//  * @throws {Error} API error response
//  */
// async function handleResponse(response) {
//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(
//       error.message || `Request failed with status ${response.status}`
//     );
//   }
//   return response.json();
// }

// /**
//  * Gets auth token from localStorage
//  * @returns {string|null} Bearer token string or null
//  */
// function getAuthToken() {
//   if (typeof window === "undefined") return null;
//   const token = localStorage.getItem("token");
//   return token ? `Bearer ${token}` : null;
// }

// /**
//  * Login user with email and password
//  * @param {Object} credentials - User credentials
//  * @param {string} credentials.email - User email
//  * @param {string} credentials.password - User password
//  * @returns {Promise<Object>} User data and token
//  */
// export async function loginUser({ email, password }) {
//   const response = await fetch(`${API_URL}/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//     body: JSON.stringify({ email, password }),
//   });

//   return handleResponse(response);
// }

// /**
//  * Register new user
//  * @param {FormData} formData - Registration form data
//  * @returns {Promise<Object>} User data and token
//  */
// export async function registerUser(formData) {
//   const response = await fetch(`${API_URL}/register`, {
//     method: "POST",
//     headers: { Accept: "application/json" },
//     body: formData,
//   });

//   return handleResponse(response);
// }

// /**
//  * Fetch paginated products with optional filters
//  * @param {Object} options - Query parameters
//  * @param {number} options.page - Page number (default: 1)
//  * @param {string} options.sort - Sort field with optional '-' prefix for descending
//  * @param {number} options.minPrice - Minimum price filter
//  * @param {number} options.maxPrice - Maximum price filter
//  * @returns {Promise<Object>} Products response with data and pagination
//  */
// export async function fetchProducts({
//   page = 1,
//   sort = "",
//   minPrice,
//   maxPrice,
// } = {}) {
//   // Build query parameters
//   const params = new URLSearchParams({ page: page.toString() });

//   if (sort) {
//     params.append("sort", sort);
//   }

//   if (minPrice >= 0) {
//     params.append("filter[price_from]", minPrice.toString());
//   }

//   if (maxPrice > 0) {
//     params.append("filter[price_to]", maxPrice.toString());
//   }

//   // Make API request
//   const response = await fetch(`${API_URL}/products?${params}`, {
//     headers: {
//       Accept: "application/json",
//       Authorization: getAuthToken() || "",
//     },
//   });

//   return handleResponse(response);
// }

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Handles API response and error checking
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} API error response
 */
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Request failed with status ${response.status}`
    );
  }
  return response.json();
}

/**
 * Gets auth token from localStorage
 * @returns {string|null} Bearer token string or null
 */
function getAuthToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : null;
}

/**
 * Login user with email and password
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} User data and token
 */
export async function loginUser({ email, password }) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
}

/**
 * Register new user
 * @param {FormData} formData - Registration form data
 * @returns {Promise<Object>} User data and token
 */
export async function registerUser(formData) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });

  return handleResponse(response);
}

/**
 * Fetch paginated products with optional filters
 * @param {number} page - Page number (default: 1)
 * @param {string} sort - Sort field with optional '-' prefix for descending
 * @param {number} minPrice - Minimum price filter
 * @param {number} maxPrice - Maximum price filter
 * @returns {Promise<Object>} Products response with data and pagination
 */
export async function fetchProducts(page = 1, sort = "", minPrice, maxPrice) {
  // Build query parameters
  const params = new URLSearchParams({ page: page.toString() });

  if (sort) {
    params.append("sort", sort);
  }

  if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
    params.append("filter[price_from]", minPrice.toString());
  }

  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
    params.append("filter[price_to]", maxPrice.toString());
  }

  // Make API request
  const response = await fetch(`${API_URL}/products?${params}`, {
    headers: {
      Accept: "application/json",
      ...(getAuthToken() && { Authorization: getAuthToken() }),
    },
  });

  return handleResponse(response);
}
