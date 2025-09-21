"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { login } from "@/services/api"; // import service

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /** Validate form fields */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (formData.email.length < 3) {
      newErrors.email = "Email must be at least 3 characters";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle input change */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  /** Handle form submission */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError("");

    try {
      await login(formData); // call authService login
      // Redirect after successful login
      window.location.href = "/";
    } catch (err) {
      setApiError(err.message || "Login failed");
      if (err.errors) setErrors(err.errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 flex">
      {/* Left Side - Hero Image */}
      <div className="w-[948px] min-h-[1000px] h-full relative">
        <Image
          src="/images/login-hero.webp"
          alt="Hero image"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[554px]">
          <h1 className="font-poppins font-semibold text-[42px] leading-[63px] text-[#10151F] mb-12">
            Log in
          </h1>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-6">
              {/* Email Field */}
              <div className="space-y-1">
                <div className="flex items-center bg-white border border-[#E1DFE1] rounded-lg px-3 py-3 h-[42px] focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
                  <div className="flex items-center flex-1 gap-1">
                    <label
                      htmlFor="email"
                      className="font-poppins text-sm text-[#3E424A] whitespace-nowrap"
                    >
                      Email
                    </label>
                    <span className="text-[#FF4000] text-sm font-poppins">
                      *
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent border-none outline-none font-poppins text-sm text-[#10151F]"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {errors.email && (
                  <p className="font-poppins text-sm text-[#FF4000] mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center bg-white border border-[#E1DFE1] rounded-lg px-3 py-3 h-[42px] focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
                  <div className="flex items-center flex-1 gap-1">
                    <label
                      htmlFor="password"
                      className="font-poppins text-sm text-[#3E424A] whitespace-nowrap"
                    >
                      Password
                    </label>
                    <span className="text-[#FF4000] text-sm font-poppins">
                      *
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent border-none outline-none font-poppins text-sm text-[#10151F]"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center p-1 hover:bg-gray-100 rounded transition-colors"
                    disabled={isLoading}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#0F172A]"
                    >
                      <path
                        d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
                        fill="currentColor"
                      />
                      {!showPassword && (
                        <path
                          d="M17.94 2.06a1 1 0 0 0-1.41 0l-15 15a1 1 0 1 0 1.41 1.41l15-15a1 1 0 0 0 0-1.41z"
                          fill="currentColor"
                        />
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && (
                  <p className="font-poppins text-sm text-[#FF4000] mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* API Error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="font-poppins text-sm text-[#FF4000]">
                  {apiError}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF4000] hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-poppins text-sm py-3 px-5 rounded-[10px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Log in"
                )}
              </button>

              <div className="flex items-center justify-center gap-2">
                <span className="font-poppins text-sm text-[#3E424A]">
                  Not a member?
                </span>
                <Link
                  href="/register"
                  className="font-poppins font-medium text-sm text-[#FF4000] hover:text-red-600 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
