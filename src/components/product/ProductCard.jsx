"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ id, name, price, cover_image }) {
  return (
    <Link
      href={`/products/${id}`}
      className="flex flex-col items-start gap-3 w-[412px] h-[614px]"
    >
      {/* Image container */}
      <div className="w-full h-[549px] relative rounded-lg overflow-hidden">
        <Image
          src={cover_image || "/images/placeholder.png"}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 412px"
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-0.5 w-full">
        <h3 className="text-[18px] font-medium leading-[18px] tracking-normal text-[#10151F]">
          {name}
        </h3>
        <p className="text-[16px] font-medium leading-[16px] tracking-normal text-[#10151F]">
          ${price}
        </p>
      </div>
    </Link>
  );
}
