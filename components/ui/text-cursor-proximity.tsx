"use client";

import React, { CSSProperties, forwardRef, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useMousePositionRef } from "@/hooks/use-mouse-position-ref";

type CSSPropertiesWithValues = {
  [K in keyof CSSProperties]: string | number;
};

interface StyleValue<T extends keyof CSSPropertiesWithValues> {
  from: CSSPropertiesWithValues[T];
  to: CSSPropertiesWithValues[T];
}

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  styles: Partial<{
    [K in keyof CSSPropertiesWithValues]: StyleValue<K>;
  }>;
  containerRef: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: "linear" | "exponential" | "gaussian";
}

const TextCursorProximity = forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      label,
      styles,
      containerRef,
      radius = 50,
      falloff = "linear",
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const mousePositionRef = useMousePositionRef(containerRef);

    const letterCount = label.replace(/\s/g, "").length;
    // One motion value per letter — count stays stable for a given label.
    const letterProximities = useRef(
      // eslint-disable-next-line react-hooks/rules-of-hooks
      Array.from({ length: letterCount }, () => useMotionValue(0))
    );

    const calcDistance = (x1: number, y1: number, x2: number, y2: number) =>
      Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    const calcFalloff = (distance: number): number => {
      const n = Math.min(Math.max(1 - distance / radius, 0), 1);
      switch (falloff) {
        case "exponential":
          return Math.pow(n, 2);
        case "gaussian":
          return Math.exp(-Math.pow(distance / (radius / 2), 2) / 2);
        default:
          return n;
      }
    };

    useAnimationFrame(() => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      letterRefs.current.forEach((letterRef, index) => {
        if (!letterRef) return;
        const rect = letterRef.getBoundingClientRect();
        const cx = rect.left + rect.width / 2 - containerRect.left;
        const cy = rect.top + rect.height / 2 - containerRect.top;
        const distance = calcDistance(
          mousePositionRef.current.x,
          mousePositionRef.current.y,
          cx,
          cy
        );
        letterProximities.current[index]?.set(calcFalloff(distance));
      });
    });

    const words = label.split(" ");
    let letterIndex = 0;

    return (
      <span
        ref={ref}
        className={`${className ?? ""} inline`}
        onClick={onClick}
        {...props}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split("").map((letter) => {
              const currentLetterIndex = letterIndex++;
              const proximity = letterProximities.current[currentLetterIndex];
              const transformedStyles = Object.entries(styles).reduce(
                (acc, [key, value]) => {
                  if (proximity && value) {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    acc[key] = useTransform(
                      proximity,
                      [0, 1],
                      [value.from, value.to]
                    );
                  }
                  return acc;
                },
                {} as Record<string, unknown>
              );

              return (
                <motion.span
                  key={currentLetterIndex}
                  ref={(el: HTMLSpanElement | null) => {
                    letterRefs.current[currentLetterIndex] = el;
                  }}
                  className="inline-block"
                  aria-hidden="true"
                  style={transformedStyles}
                >
                  {letter}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
        <span className="sr-only">{label}</span>
      </span>
    );
  }
);

TextCursorProximity.displayName = "TextCursorProximity";
export default TextCursorProximity;
