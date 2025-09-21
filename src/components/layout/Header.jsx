"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = ({
  userAvatar = "/images/placeholder.png",
  cartItemCount = 0,
  onCartClick,
  onProfileClick,
}) => {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  const HandEyeIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M13.5 16.875C13.5 17.1717 13.412 17.4617 13.2472 17.7084C13.0824 17.955 12.8481 18.1473 12.574 18.2608C12.2999 18.3744 11.9983 18.4041 11.7074 18.3462C11.4164 18.2883 11.1491 18.1454 10.9393 17.9357C10.7296 17.7259 10.5867 17.4586 10.5288 17.1676C10.4709 16.8767 10.5006 16.5751 10.6142 16.301C10.7277 16.0269 10.92 15.7926 11.1666 15.6278C11.4133 15.463 11.7033 15.375 12 15.375C12.3978 15.375 12.7794 15.533 13.0607 15.8143C13.342 16.0956 13.5 16.4772 13.5 16.875ZM20.25 9.75V14.25C20.25 16.438 19.3808 18.5365 17.8336 20.0836C16.2865 21.6308 14.188 22.5 12 22.5C9.81196 22.5 7.71354 21.6308 6.16637 20.0836C4.61919 18.5365 3.75 16.438 3.75 14.25V6C3.75 5.60218 3.90804 5.22064 4.18934 4.93934C4.47064 4.65804 4.85218 4.5 5.25 4.5C5.64782 4.5 6.02936 4.65804 6.31066 4.93934C6.59196 5.22064 6.75 5.60218 6.75 6V11.25C6.75 11.4489 6.82902 11.6397 6.96967 11.7803C7.11032 11.921 7.30109 12 7.5 12C7.69891 12 7.88968 11.921 8.03033 11.7803C8.17098 11.6397 8.25 11.4489 8.25 11.25V3C8.25 2.60218 8.40804 2.22064 8.68934 1.93934C8.97064 1.65804 9.35218 1.5 9.75 1.5C10.1478 1.5 10.5294 1.65804 10.8107 1.93934C11.092 2.22064 11.25 2.60218 11.25 3V10.5C11.25 10.6989 11.329 10.8897 11.4697 11.0303C11.6103 11.171 11.8011 11.25 12 11.25C12.1989 11.25 12.3897 11.171 12.5303 11.0303C12.671 10.8897 12.75 10.6989 12.75 10.5V4.5C12.75 4.10218 12.908 3.72064 13.1893 3.43934C13.4706 3.15804 13.8522 3 14.25 3C14.6478 3 15.0294 3.15804 15.3107 3.43934C15.592 3.72064 15.75 4.10218 15.75 4.5V12C15.75 12.1989 15.829 12.3897 15.9697 12.5303C16.1103 12.671 16.3011 12.75 16.5 12.75C16.6989 12.75 16.8897 12.671 17.0303 12.5303C17.171 12.3897 17.25 12.1989 17.25 12V9.75C17.25 9.35218 17.408 8.97064 17.6893 8.68934C17.9706 8.40804 18.3522 8.25 18.75 8.25C19.1478 8.25 19.5294 8.40804 19.8107 8.68934C20.092 8.97064 20.25 9.35218 20.25 9.75ZM16.8356 16.7072C16.77 16.5759 15.195 13.5 12 13.5C8.805 13.5 7.23 16.5759 7.16437 16.7072C7.1383 16.7593 7.12473 16.8167 7.12473 16.875C7.12473 16.9333 7.1383 16.9907 7.16437 17.0428C7.23 17.1741 8.805 20.25 12 20.25C15.195 20.25 16.77 17.1741 16.8356 17.0428C16.8617 16.9907 16.8753 16.9333 16.8753 16.875C16.8753 16.8167 16.8617 16.7593 16.8356 16.7072Z"
        fill="#FF4000"
      />
    </svg>
  );

  const CartIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M2.25 2.25C1.83579 2.25 1.5 2.58579 1.5 3C1.5 3.41421 1.83579 3.75 2.25 3.75H3.63568C3.80558 3.75 3.95425 3.86422 3.99803 4.02838L6.55576 13.6199C4.94178 14.0385 3.75 15.5051 3.75 17.25C3.75 17.6642 4.08579 18 4.5 18H20.25C20.6642 18 21 17.6642 21 17.25C21 16.8358 20.6642 16.5 20.25 16.5H5.37803C5.68691 15.6261 6.52034 15 7.5 15H18.7183C19.0051 15 19.2668 14.8364 19.3925 14.5785C20.5277 12.249 21.5183 9.83603 22.3527 7.35126C22.4191 7.15357 22.4002 6.93716 22.3005 6.75399C22.2008 6.57082 22.0294 6.43743 21.8273 6.38583C17.0055 5.15442 11.9536 4.5 6.75 4.5C6.39217 4.5 6.03505 4.5031 5.67868 4.50926L5.44738 3.64188C5.2285 2.82109 4.48515 2.25 3.63568 2.25H2.25Z"
        fill="#10151F"
      />
      <path
        d="M3.75 20.25C3.75 19.4216 4.42157 18.75 5.25 18.75C6.07843 18.75 6.75 19.4216 6.75 20.25C6.75 21.0784 6.07843 21.75 5.25 21.75C4.42157 21.75 3.75 21.0784 3.75 20.25Z"
        fill="#10151F"
      />
      <path
        d="M16.5 20.25C16.5 19.4216 17.1716 18.75 18 18.75C18.8284 18.75 19.5 19.4216 19.5 20.25C19.5 21.0784 18.8284 21.75 18 21.75C17.1716 21.75 16.5 21.0784 16.5 20.25Z"
        fill="#10151F"
      />
    </svg>
  );

  const UserProfileIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M10.001 8C11.6578 8 13.001 6.65685 13.001 5C13.001 3.34315 11.6578 2 10.001 2C8.34412 2 7.00098 3.34315 7.00098 5C7.00098 6.65685 8.34412 8 10.001 8Z"
        fill="#10151F"
      />
      <path
        d="M3.46615 14.4935C3.27126 15.0016 3.44533 15.571 3.87518 15.9046C5.56753 17.218 7.69299 18 10.0011 18C12.3115 18 14.439 17.2164 16.1322 15.9006C16.5618 15.5667 16.7355 14.9971 16.5403 14.4892C15.531 11.8635 12.9852 10 10.004 10C7.02129 10 4.47427 11.8656 3.46615 14.4935Z"
        fill="#10151F"
      />
    </svg>
  );

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-20 flex items-center justify-between px-6 md:px-12 lg:px-24 bg-white shadow-sm z-50">
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-1"
        aria-label="RedSeam Clothing home"
      >
        <HandEyeIcon />
        <h1 className="font-poppins font-semibold text-base leading-6 text-slate-900 whitespace-nowrap">
          RedSeam Clothing
        </h1>
      </Link>

      {isAuthPage ? (
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="w-10 h-10 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
            aria-label="User profile menu"
          >
            <UserProfileIcon />
          </Link>
          <span className="font-poppins text-sm font-normal text-slate-900 whitespace-nowrap">
            Login
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <button
            onClick={onCartClick}
            className="relative hover:opacity-80 transition-opacity rounded-md p-1"
            aria-label={`Shopping cart${
              cartItemCount > 0 ? ` with ${cartItemCount} items` : ""
            }`}
          >
            <CartIcon />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-medium">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </button>

          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity rounded-md p-1"
            aria-label="User profile menu"
          >
            <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-gray-200">
              <Image
                src={userAvatar}
                alt="User avatar"
                fill
                className="object-cover"
                sizes="40px"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <UserProfileIcon />
              </div>
            </div>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
