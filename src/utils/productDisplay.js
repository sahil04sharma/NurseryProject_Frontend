import React, { createElement, Fragment } from "react";

export const defaultGetProductDisplay = (product) => {
  const image =
    product?.bannerImg?.[0] ||
    product?.variants?.[0]?.variantImg ||
    product?.colorCategory?.[0]?.image ||
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop";

  const price = product?.variants?.[0]?.sellingPrice ?? product?.sellingPrice ?? 0;
  const originalPrice =
    product?.variants?.[0]?.offerPrice ?? product?.offerPrice ?? null;

  let description = "High-quality plant for your space.";
  try {
    if (Array.isArray(product?.description) && product.description.length > 0) {
      let desc = product.description[0];

      // keep parsing until real text found
      while (typeof desc === "string" && (desc.startsWith("[") || desc.startsWith("{"))) {
        desc = JSON.parse(desc);
        if (Array.isArray(desc)) desc = desc[0];
      }

      description = desc || description;
    }
  } catch (e) {
    console.warn("Description parse error:", e);
  }

  const stock = product?.variants?.[0]?.stock ?? product?.stock ?? 0;

  return {
    image,
    price,
    originalPrice,
    description,
    stock,
    category: product?.category,
    name: product?.name,
  };
};

export const defaultRenderStars = (rating = 4.5) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const total = 5;

  return createElement(
    Fragment,
    null,
    Array.from({ length: total }).map((_, i) =>
      createElement(
        "span",
        {
          key: i,
          "aria-hidden": true,
          className: "text-yellow-400",
        },
        i < full || (i === full && half) ? "★" : "☆"
      )
    )
  );
};
