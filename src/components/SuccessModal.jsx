"use client";

import React from "react";

const SuccessModal = ({ isOpen, onClose, title, message, buttonText }) => {
  if (!isOpen) return null;

  const CheckmarkIcon = () => (
    <svg
      width="76"
      height="76"
      viewBox="0 0 76 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="38" cy="38" r="38" fill="#F8F6F7" />
      <path
        d="M32.8129 53C32.2414 53 31.7413 52.7775 31.3841 52.3641L20.3761 42.6813C19.7689 41.9819 19.9118 40.9963 20.6976 40.4558C21.4834 39.9154 22.5907 40.0426 23.1979 40.742L32.7414 48.7398L52.7796 24.641C53.3511 23.9415 54.494 23.7826 55.2799 24.3231C56.0657 24.8317 56.2443 25.8491 55.637 26.5485L34.2059 52.3324C33.9201 52.7457 33.3844 53 32.8129 53Z"
        fill="#318A1D"
      />
    </svg>
  );

  const CloseIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#3E424A]"
    >
      <path
        d="M15.5607 4.43934C15.2678 4.14645 14.7928 4.14645 14.5 4.43934L10 8.93934L5.5 4.43934C5.20711 4.14645 4.73214 4.14645 4.43934 4.43934C4.14645 4.73223 4.14645 5.20721 4.43934 5.5L8.93934 10L4.43934 14.5C4.14645 14.7929 4.14645 15.2679 4.43934 15.5607C4.73223 15.8536 5.20721 15.8536 5.5 15.5607L10 11.0607L14.5 15.5607C14.7929 15.8536 15.2679 15.8536 15.5607 15.5607C15.8536 15.2678 15.8536 14.7928 15.5607 14.5L11.0607 10L15.5607 5.5C15.8536 5.20711 15.8536 4.73214 15.5607 4.43934Z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg relative"
        style={{
          width: "876px",
          maxWidth: "90vw",
          height: "590px",
          maxHeight: "90vh",
        }}
      >
        {/* Close button - positioned at top: 30px, right: 40px (876 - 806 - 40 = 30) */}
        <button
          onClick={onClose}
          className="absolute hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          style={{
            width: "40px",
            height: "40px",
            top: "30px",
            right: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>

        {/* Content container - centered with proper spacing */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            width: "233px",
            left: "50%",
            transform: "translateX(-50%)",
            top: "114px",
          }}
        >
          {/* Checkmark icon */}
          <div style={{ marginBottom: "40px" }}>
            <CheckmarkIcon />
          </div>

          {/* Text content */}
          <div
            className="flex flex-col items-center text-center"
            style={{ gap: "16px" }}
          >
            <h2
              className="font-semibold leading-none"
              style={{
                fontSize: "42px",
                lineHeight: "63px",
                color: "#10151F",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {title || "Congrats!"}
            </h2>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "21px",
                color: "#3E424A",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {message || "Your order is placed successfully!"}
            </p>
          </div>
        </div>

        {/* Continue Shopping button - positioned at bottom */}
        <button
          onClick={onClose}
          className="absolute hover:opacity-90 transition-opacity cursor-pointer"
          style={{
            width: "214px",
            height: "41px",
            left: "50%",
            transform: "translateX(-50%)",
            top: "404px",
            backgroundColor: "#FF4000",
            borderRadius: "10px",
            color: "white",
            fontSize: "14px",
            lineHeight: "21px",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {buttonText || "Continue shopping"}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
