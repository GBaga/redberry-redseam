// import ProductDetailClient from "./ProductDetailClient";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export default async function ProductPage({ params }) {
//   const { id } = params;

//   try {
//     const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
//     if (!res.ok) return <div className="p-10">Failed to load product</div>;

//     const product = await res.json();
//     return <ProductDetailClient product={product} />;
//   } catch (err) {
//     return <div className="p-10">Something went wrong</div>;
//   }
// }

// app/products/[id]/page.js
import ProductDetailClient from "./ProductDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function ProductPage({ params }) {
  // Await params in Next.js 15
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return <div className="p-10">Failed to load product</div>;
    }

    const product = await res.json();

    // ProductDetailClient will receive onAddToCart prop from MainLayout
    return <ProductDetailClient product={product} />;
  } catch (err) {
    return <div className="p-10">Something went wrong</div>;
  }
}
