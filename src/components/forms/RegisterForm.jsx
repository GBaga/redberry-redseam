// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import AuthForm from "@/components/AuthForm";

// /**
//  * Register Form Component
//  * @param {Object} props
//  * @param {Function} props.onSubmit - Submit handler function
//  * @param {boolean} props.isLoading - Loading state
//  * @param {string} props.error - Error message from API
//  */
// const RegisterForm = ({ onSubmit, isLoading = false, error = "" }) => {
//   // Form data state
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     avatar: null,
//     avatarPreview: null,
//   });

//   // Validation errors state
//   const [errors, setErrors] = useState({});

//   // Password visibility toggles
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   /**
//    * Validate all form fields
//    */
//   const validateForm = () => {
//     const newErrors = {};

//     // Username validation (min 3 characters)
//     if (!formData.username.trim()) {
//       newErrors.username = "Username is required";
//     } else if (formData.username.length < 3) {
//       newErrors.username = "Username must be at least 3 characters";
//     }

//     // Email validation
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     // Password validation (min 3 characters per requirements)
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 3) {
//       newErrors.password = "Password must be at least 3 characters";
//     }

//     // Confirm password validation
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password";
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /**
//    * Handle input field changes
//    */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear error for this field when user types
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }

//     // Re-validate confirm password when password changes
//     if (name === "password" && formData.confirmPassword) {
//       if (value !== formData.confirmPassword) {
//         setErrors((prev) => ({
//           ...prev,
//           confirmPassword: "Passwords do not match",
//         }));
//       } else {
//         setErrors((prev) => ({
//           ...prev,
//           confirmPassword: "",
//         }));
//       }
//     }
//   };

//   /**
//    * Handle avatar file selection
//    */
//   const handleAvatarChange = (e) => {
//     const file = e.target.files?.[0];

//     if (file) {
//       // Validate file type (images only)
//       if (!file.type.startsWith("image/")) {
//         setErrors((prev) => ({
//           ...prev,
//           avatar: "Please select an image file",
//         }));
//         return;
//       }

//       // Create preview URL
//       const previewUrl = URL.createObjectURL(file);

//       setFormData((prev) => ({
//         ...prev,
//         avatar: file,
//         avatarPreview: previewUrl,
//       }));

//       // Clear avatar error
//       setErrors((prev) => ({
//         ...prev,
//         avatar: "",
//       }));
//     }
//   };

//   /**
//    * Handle form submission
//    */
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     // Prepare form data for API
//     const submitData = new FormData();
//     submitData.append("username", formData.username);
//     submitData.append("email", formData.email);
//     submitData.append("password", formData.password);
//     submitData.append("password_confirmation", formData.confirmPassword);

//     if (formData.avatar) {
//       submitData.append("avatar", formData.avatar);
//     }

//     onSubmit?.(submitData);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Left Side - Hero Image */}
//       <div className="hidden lg:block lg:w-1/2 relative">
//         <Image
//           src="/images/login-hero.webp"
//           alt="Hero"
//           fill
//           className="object-cover"
//           priority
//         />
//       </div>

//       {/* Right Side - Register Form */}
//       <div className="flex-1 flex items-center justify-center px-6 py-12">
//         <div className="w-full max-w-md">
//           <h1 className="text-3xl font-bold text-gray-900 mb-8">Register</h1>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Username Field */}
//             <div>
//               <label
//                 htmlFor="username"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Username <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 value={formData.username}
//                 onChange={handleInputChange}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
//                   errors.username ? "border-red-500" : "border-gray-300"
//                 }`}
//                 disabled={isLoading}
//               />
//               {errors.username && (
//                 <p className="mt-1 text-sm text-red-600">{errors.username}</p>
//               )}
//             </div>

//             {/* Email Field */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
//                   errors.email ? "border-red-500" : "border-gray-300"
//                 }`}
//                 disabled={isLoading}
//               />
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
//                     errors.password ? "border-red-500" : "border-gray-300"
//                   }`}
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
//                   disabled={isLoading}
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//               )}
//             </div>

//             {/* Confirm Password Field */}
//             <div>
//               <label
//                 htmlFor="confirmPassword"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Confirm Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type={showConfirmPassword ? "text" : "password"}
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
//                     errors.confirmPassword
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
//                   disabled={isLoading}
//                 >
//                   {showConfirmPassword ? "Hide" : "Show"}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-600">
//                   {errors.confirmPassword}
//                 </p>
//               )}
//             </div>

//             {/* Avatar Field (Optional) */}
//             <div>
//               <label
//                 htmlFor="avatar"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Avatar (optional)
//               </label>
//               <input
//                 id="avatar"
//                 name="avatar"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleAvatarChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                 disabled={isLoading}
//               />
//               {errors.avatar && (
//                 <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
//               )}

//               {/* Avatar Preview */}
//               {formData.avatarPreview && (
//                 <div className="mt-3">
//                   <p className="text-sm text-gray-600 mb-2">Preview:</p>
//                   <Image
//                     src={formData.avatarPreview}
//                     alt="Avatar preview"
//                     width={80}
//                     height={80}
//                     className="rounded-full object-cover border-2 border-gray-200"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* API Error Message */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                 <p className="text-sm text-red-600">{error}</p>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Creating account...
//                 </span>
//               ) : (
//                 "Create Account"
//               )}
//             </button>

//             {/* Login Link */}
//             <div className="text-center">
//               <span className="text-sm text-gray-600">
//                 Already have an account?{" "}
//                 <Link
//                   href="/login"
//                   className="text-red-500 hover:text-red-600 font-medium"
//                 >
//                   Log in
//                 </Link>
//               </span>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterForm;

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { register } from "@/services/api"; // import service

const RegisterForm = () => {
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

  /** Validate all form fields */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle input changes */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");

    if (name === "password" && formData.confirmPassword) {
      if (value !== formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  /** Handle avatar selection */
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

      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: previewUrl,
      }));
      setErrors((prev) => ({ ...prev, avatar: "" }));
    }
  };

  /** Handle form submission */
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
      await register(submitData); // call authService register
      // Redirect to login after successful registration
      window.location.href = "/login";
    } catch (err) {
      setApiError(err.message || "Registration failed");
      if (err.errors) setErrors(err.errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/login-hero.webp"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Register</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={isLoading}
              />
              {errors.avatar && (
                <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
              )}
              {formData.avatarPreview && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <Image
                    src={formData.avatarPreview}
                    alt="Avatar preview"
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{apiError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-red-500 hover:text-red-600 font-medium"
                >
                  Log in
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
