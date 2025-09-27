"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { register } from "@/services/api";

const RegisterForm = () => {
  const getTextWidth = (text, font) => {
    if (typeof window === "undefined") return 0;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    return context.measureText(text).width;
  };

  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    avatarPreview: null,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /** Validate form */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle input */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  };

  /** Avatar upload */
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Please select an image file",
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      }));
      setErrors((prev) => ({ ...prev, avatar: "" }));
    }
  };

  const removeAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: null, avatarPreview: null }));
  };

  /** Submit */
  /** Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = new FormData();
    submitData.append("username", formData.username);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("password_confirmation", formData.confirmPassword);
    if (formData.avatar) submitData.append("avatar", formData.avatar);

    setIsLoading(true);
    setApiError("");

    try {
      // Clear any existing cart state before registration
      if (typeof window !== "undefined") {
        // Dispatch custom event to clear cart
        window.dispatchEvent(new CustomEvent("clearCart"));
      }

      await register(submitData);
      router.push("/login");
    } catch (err) {
      setApiError(err.message || "Registration failed");
      if (err.errors) setErrors(err.errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Hero */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/login-hero.webp"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-[554px]">
          <h1
            className="text-[42px] leading-[63px] font-semibold mb-12"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#10151F" }}
          >
            Registration
          </h1>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Avatar Upload */}
            <div className="flex items-center gap-[15px]">
              <div className="flex items-center gap-[15px] group">
                <div className="relative">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                    {formData.avatarPreview ? (
                      <Image
                        src={formData.avatarPreview}
                        alt="Avatar"
                        width={100}
                        height={100}
                        className="w-[100px] h-[100px] rounded-full object-cover group-hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </label>
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <span
                    className="text-[14px] leading-[21px] text-[#3E424A] group-hover:text-[#FF4000] transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Upload new
                  </span>
                </label>
              </div>
              {formData.avatarPreview && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  disabled={isLoading}
                  className="text-[14px] leading-[21px] text-[#3E424A] hover:text-[#FF4000] cursor-pointer transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-[24px]">
              {/* Username */}
              <div className="relative">
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full h-[42px] px-3 border rounded-lg text-[14px] leading-[21px] placeholder-[#3E424A] ${
                    errors.username ? "border-red-500" : "border-[#E1DFE1]"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />

                {/* Asterisk that disappears when user types */}
                {!formData.username && (
                  <span
                    className="absolute top-1/2 -translate-y-1/2 text-[#FF4000] pointer-events-none text-[14px]"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      left: `calc(12px + ${getTextWidth(
                        "Username",
                        "14px Poppins"
                      )}px + 4px)`,
                    }}
                  >
                    *
                  </span>
                )}

                {errors.username && (
                  <p className="text-sm text-[#FF4000]">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full h-[42px] px-3 border rounded-lg text-[14px] leading-[21px] placeholder-[#3E424A] ${
                    errors.email ? "border-red-500" : "border-[#E1DFE1]"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />

                {/* Asterisk that disappears when user types */}
                {!formData.email && (
                  <span
                    className="absolute top-1/2 -translate-y-1/2 text-[#FF4000] pointer-events-none text-[14px]"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      left: `calc(12px + ${getTextWidth(
                        "Email",
                        "14px Poppins"
                      )}px + 4px)`,
                    }}
                  >
                    *
                  </span>
                )}

                {errors.email && (
                  <p className="text-sm text-[#FF4000]">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full h-[42px] px-3 border rounded-lg text-[14px] leading-[21px] placeholder-[#3E424A] ${
                    errors.password ? "border-red-500" : "border-[#E1DFE1]"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />

                {/* Asterisk that disappears when user types */}
                {!formData.password && (
                  <span
                    className="absolute top-1/2 -translate-y-1/2 text-[#FF4000] pointer-events-none text-[14px]"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      left: `calc(12px + ${getTextWidth(
                        "Password",
                        "14px Poppins"
                      )}px + 4px)`,
                    }}
                  >
                    *
                  </span>
                )}

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
                  <p className="text-sm text-[#FF4000]">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full h-[42px] px-3 border rounded-lg text-[14px] leading-[21px] placeholder-[#3E424A] ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-[#E1DFE1]"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />

                {/* Asterisk that disappears when user types */}
                {!formData.confirmPassword && (
                  <span
                    className="absolute top-1/2 -translate-y-1/2 text-[#FF4000] pointer-events-none text-[14px]"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      left: `calc(12px + ${getTextWidth(
                        "Confirm Password",
                        "14px Poppins"
                      )}px + 4px)`,
                    }}
                  >
                    *
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? (
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

                {errors.confirmPassword && (
                  <p className="text-sm text-[#FF4000]">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* API Error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-[#FF4000]">{apiError}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col items-center gap-[24px]">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[52px] bg-[#FF4000] text-white text-[16px] leading-[24px] font-semibold rounded-lg hover:bg-[#e63900] disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
              <p className="text-[14px] text-[#3E424A]">
                Already member?{" "}
                <Link
                  href="/login"
                  className="text-[#FF4000] hover:underline font-medium"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
