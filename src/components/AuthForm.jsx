"use client";

import Image from "next/image";
import React, { useState } from "react";

/**
 * AuthForm component for login and registration
 * @param {Object} props
 * @param {"login" | "register"} props.type - Form type
 * @param {Function} props.onSubmit - Submit handler
 */
const AuthForm = ({ type, onSubmit }) => {
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const username = formData.get("username") || "";
    const email = formData.get("email") || "";
    const password = formData.get("password") || "";
    const confirmPassword = formData.get("confirmPassword") || "";

    const newErrors = {};

    if (type === "login") {
      // Login validation
      if (username.length < 3) {
        newErrors.username =
          "Username or Email must have at least 3 characters";
      }
      if (password.length < 3) {
        newErrors.password = "Password must be at least 3 characters";
      }
    } else {
      // Register validation
      if (username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }
      if (!email.includes("@")) {
        newErrors.email = "Invalid email format";
      }
      if (password.length < 3) {
        newErrors.password = "Password must be at least 3 characters";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({ username, email, password, avatar: avatarFile });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white"
    >
      <h1 className="text-2xl font-bold mb-4 text-center">
        {type === "login" ? "Login" : "Register"}
      </h1>

      {/* Username / Email */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {type === "login" ? "Email or Username" : "Username"}
        </label>
        <input
          type="text"
          name="username"
          className="w-full border rounded p-2"
          required
        />
        {errors.username && (
          <p className="text-red-600 text-sm mt-1">{errors.username}</p>
        )}
      </div>

      {/* Email - Register only */}
      {type === "register" && (
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border rounded p-2"
            required
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      )}

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          className="w-full border rounded p-2"
          required
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password - Register only */}
      {type === "register" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full border rounded p-2"
            required
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
          <label className="block text-sm font-medium mb-1">
            Avatar (optional)
          </label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {avatarPreview && (
            <Image
              src={avatarPreview}
              alt="Avatar preview"
              width={64}
              height={64}
              className="mt-2 rounded-full object-cover"
            />
          )}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {type === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
};

export default AuthForm;
