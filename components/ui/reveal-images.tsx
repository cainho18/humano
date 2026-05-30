"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

interface RevealImageOnHoverProps {
  src: string;
  alt: string;
  children: React.ReactNode;
  className?: string;
  /** image box size in px (collapsed → expands on hover) */
  size?: number;
}

/**
 * Wraps a trigger (e.g. a button label). On hover, an image scales/fades in
 * floating above the trigger. Used for the "Atravessar" portal → espelho_01.
 */
export function RevealImageOnHover({
  src,
  alt,
  children,
  className,
  size = 220,
}: RevealImageOnHoverProps) {
  return (
    <div className={cn("group relative inline-flex", className)}>
      <div
        className="pointer-events-none absolute left-1/2 bottom-full z-40 mb-4 -translate-x-1/2 origin-bottom scale-0 opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="220px"
          className="object-contain drop-shadow-[0_0_24px_rgba(255,0,170,0.6)]"
        />
      </div>
      {children}
    </div>
  );
}
