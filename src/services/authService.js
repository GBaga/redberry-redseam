const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Login user
 * @param {Object} data - { email, password }
 * @returns {Promise<Object>} - { token, user } or throws error
 */
export async function login(data) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    const error = responseData.message || "Login failed";
    error.errors = responseData.errors || {};
    throw error;
  }

  // Store token and user locally
  localStorage.setItem("token", responseData.token);
  localStorage.setItem("user", JSON.stringify(responseData.user));

  return responseData;
}

/**
 * Register user
 * @param {FormData} formData
 * @returns {Promise<Object>} - { token, user } or throws error
 */
export async function register(formData) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  const responseData = await res.json();

  if (!res.ok) {
    const error = responseData.message || "Registration failed";
    // Convert API errors to field-level errors
    error.errors = {};
    if (responseData.errors) {
      Object.keys(responseData.errors).forEach((key) => {
        error.errors[key] = responseData.errors[key][0];
      });
    }
    throw error;
  }

  // Store token and user locally
  localStorage.setItem("token", responseData.token);
  localStorage.setItem("user", JSON.stringify(responseData.user));

  return responseData;
}
