"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";

/**
 * AuthForm component for login and registration with API integration
 * @param {Object} props
 * @param {"login" | "register"} props.type - Form type
 */
const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  /**
   * Handle input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear alert when user starts typing
    if (alert.show) {
      setAlert({ show: false, type: "", message: "" });
    }
  };

  /**
   * Validate form fields
   */
  const validateForm = () => {
    const newErrors = {};

    if (type === "login") {
      // Login validation - email can also be username
      if (!formData.email.trim()) {
        newErrors.email = "Email or Username is required";
      } else if (formData.email.length < 3) {
        newErrors.email = "Must have at least 3 characters";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 3) {
        newErrors.password = "Password must be at least 3 characters";
      }
    } else {
      // Register validation
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 3) {
        newErrors.password = "Password must be at least 3 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle avatar file selection
   */
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    setAvatarFile(file);

    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Please select an image file",
        }));
        return;
      }
      setAvatarPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, avatar: "" }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAlert({ show: false, type: "", message: "" });

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://api.redseam.redberryinternship.ge/api";

      if (type === "login") {
        // Login API call
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store token
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Show success alert
          setAlert({
            show: true,
            type: "success",
            message: "Login successful! Redirecting...",
          });

          // Redirect after 2 seconds
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        } else {
          // Handle errors
          if (data.errors) {
            setErrors(data.errors);
          }
          setAlert({
            show: true,
            type: "error",
            message: data.message || "Invalid email or password",
          });
        }
      } else {
        // Register API call
        const formDataToSend = new FormData();
        formDataToSend.append("username", formData.username);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append(
          "password_confirmation",
          formData.confirmPassword
        );

        if (avatarFile) {
          formDataToSend.append("avatar", avatarFile);
        }

        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formDataToSend,
        });

        const data = await response.json();

        if (response.ok) {
          // Store token
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Show success alert
          setAlert({
            show: true,
            type: "success",
            message: "Registration successful! Redirecting...",
          });

          // Redirect after 2 seconds
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        } else {
          // Handle errors
          if (data.errors) {
            // Convert API errors to field errors
            const fieldErrors = {};
            Object.keys(data.errors).forEach((key) => {
              fieldErrors[key] = data.errors[key][0];
            });
            setErrors(fieldErrors);
          }
          setAlert({
            show: true,
            type: "error",
            message:
              data.message ||
              "Registration failed. Please check your information.",
          });
        }
      }
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: "Network error. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Image */}
      <div className="hidden lg:block w-1/2 relative bg-gray-100">
        <Image
          src="/images/login-hero.webp"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8">
            {type === "login" ? "Login" : "Register"}
          </h1>

          {/* Alert Message */}
          {alert.show && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                alert.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <p className="text-sm font-medium">{alert.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login: Email/Username field */}
            {type === "login" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email or Username
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            )}

            {/* Register: Username field */}
            {type === "register" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">{errors.username}</p>
                )}
              </div>
            )}

            {/* Email - Register only */}
            {type === "register" && (
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password - Register only */}
            {type === "register" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Avatar - Register only */}
            {type === "register" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Avatar (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled={isLoading}
                />
                {errors.avatar && (
                  <p className="text-red-600 text-sm mt-1">{errors.avatar}</p>
                )}
                {avatarPreview && (
                  <div className="mt-3">
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      width={64}
                      height={64}
                      className="rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {type === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                <span>{type === "login" ? "Login" : "Register"}</span>
              )}
            </button>

            {/* Toggle Link */}
            <div className="text-center text-sm">
              {type === "login" ? (
                <span>
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:underline"
                  >
                    Register
                  </Link>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Login
                  </Link>
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
