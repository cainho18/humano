"use client";

import * as React from "react";
import { MotionValue, motion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const PADDING = 10;

interface CounterProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  start?: number;
  end: number;
  /** seconds for the full count */
  duration?: number;
  className?: string;
  fontSize?: number;
  onComplete?: () => void;
}

export const Counter = ({
  start = 0,
  end,
  duration = 10,
  className,
  fontSize = 120,
  onComplete,
  ...rest
}: CounterProps) => {
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (value >= end) {
      onComplete?.();
      return;
    }
    const stepMs = (duration / (end - start)) * 1000;
    const id = setTimeout(() => setValue((p) => p + 1), stepMs);
    return () => clearTimeout(id);
  }, [value, end, start, duration, onComplete]);

  return (
    <div
      style={{ fontSize }}
      {...rest}
      className={cn(
        "flex overflow-hidden leading-none font-mono font-bold tabular-nums",
        className
      )}
    >
      {value >= 100 && <Digit place={100} value={value} fontSize={fontSize} />}
      {value >= 10 && <Digit place={10} value={value} fontSize={fontSize} />}
      <Digit place={1} value={value} fontSize={fontSize} />
    </div>
  );
};

function Digit({
  place,
  value,
  fontSize,
}: {
  place: number;
  value: number;
  fontSize: number;
}) {
  const height = fontSize + PADDING;
  const valueRoundedToPlace = Math.floor(value / place);
  const animatedValue = useSpring(valueRoundedToPlace, {
    stiffness: 120,
    damping: 20,
  });

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <div style={{ height }} className="relative w-[1ch] tabular-nums">
      {[...Array(10)].map((_, i) => (
        <Num key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}

function Num({
  mv,
  number,
  height,
}: {
  mv: MotionValue<number>;
  number: number;
  height: number;
}) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) memo -= 10 * height;
    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {number}
    </motion.span>
  );
}
