"use client";

import { useState } from "react";

/**
 * Renders the store owner's photo when present at /models/pose.jpg,
 * otherwise falls back to the curated editorial campaign image.
 * Drop your photo into public/models/pose.jpg to feature it everywhere.
 */
export default function ModelPhoto({
  className = "",
  alt = "RYVENO campaign model",
  fallback = "/images/hero-men.jpg",
}: {
  className?: string;
  alt?: string;
  fallback?: string;
}) {
  const [src, setSrc] = useState("/models/pose.jpg");
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setSrc(fallback)}
      className={className}
    />
  );
}
