// components/footer/FooterLinks.jsx
import Link from "next/link";
import React from "react";

const FooterLinks = () => (
  <p className="text-sm text-gray-500 dark:text-gray-300 sm:text-center md:order-first">
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
    ყველა უფლება დაცულია.
  </p>
);

export default FooterLinks;
