"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { login } from "@/services/api";

const LoginForm = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getTextWidth = (text, font) => {
    if (typeof document === "undefined") return 0;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return 0;
    context.font = font;
    return context.measureText(text).width;
  };

  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setApiError("");

    try {
      await login(formData);
      router.push("/");
    } catch (err) {
      setApiError(err.message || "Login failed");
      if (err.errors) setErrors(err.errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/login-hero.webp"
          alt="Hero image"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[554px]">
          <h1 className="font-poppins font-semibold text-[42px] leading-[63px] text-[#10151F] mb-12">
            Log in
          </h1>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white border border-[#E1DFE1] rounded-lg px-4 py-3 font-poppins text-sm text-[#10151F] focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isLoading}
              />

              {/* Asterisk that disappears when user types */}
              {!formData.email && isClient && (
                <span
                  className="absolute top-1/2 -translate-y-1/2 text-[#FF4000] pointer-events-none text-sm font-poppins"
                  style={{
                    left: `calc(16px + ${getTextWidth(
                      "Email",
                      "14px Poppins"
                    )}px + 4px)`,
                  }}
                >
                  *
                </span>
              )}

              {errors.email && (
                <p className="font-poppins text-sm text-[#FF4000] mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-white border border-[#E1DFE1] rounded-lg px-4 py-3 font-poppins text-sm text-[#10151F] focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                disabled={isLoading}
              />

              {/* Asterisk that disappears when user types */}
              {!formData.password && isClient && (
                <span
                  className="absolute top-1/2 -translate-y-1/2 text-[#FF4000] pointer-events-none text-sm font-poppins"
                  style={{
                    left: `calc(16px + ${getTextWidth(
                      "Password",
                      "14px Poppins"
                    )}px + 4px)`,
                  }}
                >
                  *
                </span>
              )}

              {/* Eye toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>

              {errors.password && (
                <p className="font-poppins text-sm text-[#FF4000] mt-1">
                  {errors.password}
                </p>
              )}
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
                {isLoading ? "Signing in..." : "Log in"}
              </button>

              <div className="flex items-center justify-center gap-2">
                <span className="font-poppins text-sm text-[#3E424A]">
                  Not a member?
                </span>
                <Link
                  href="/register"
                  className="font-poppins font-medium text-sm text-[#FF4000] hover:text-red-600 transition-colors cursor-pointer"
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
