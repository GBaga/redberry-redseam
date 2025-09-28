// components/footer/FooterLinks.jsx
import Link from "next/link";
import React from "react";

const FooterLinks = () => (
  <div className="text-sm text-gray-500 dark:text-gray-300 md:order-first">
    <div className="sm:text-center">
      <p>
        © 2025 GBaga for
        <Link
          href="https://redberry.international/bootcamp/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-400 hover:text-red-500 transition-colors mx-1"
        >
          Redberry
        </Link>
        <Link
          href="https://redberry.gitbook.io/redberry-bootcamp.store-shopping-website"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors"
        >
          Bootcamp #10
        </Link>{" "}
        | ყველა უფლება დაცულია.
      </p>
    </div>
    <div className="text-left">
      <Link
        href="https://project-33-red-berry-momentum.vercel.app/"
        className="hover:text-gray-400 transition-colors"
      >
        Bootcamp #9 Momentum
      </Link>
    </div>
  </div>
);

export default FooterLinks;
