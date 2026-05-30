"use client";

import { useEffect, useRef, useState } from "react";
import { MotionProps } from "framer-motion";

type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & MotionProps;

const defaultChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = "p",
  trigger = true,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(children);
  const animatingRef = useRef(false);

  const text = children;

  const scramble = async () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    const steps = duration / speed;
    let step = 0;
    const interval = setInterval(() => {
      let scrambled = "";
      const progress = step / steps;
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          scrambled += " ";
          continue;
        }
        if (progress * text.length > i) {
          scrambled += text[i];
        } else {
          scrambled +=
            characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }
      setDisplayText(scrambled);
      step++;
      if (step > steps) {
        clearInterval(interval);
        setDisplayText(text);
        animatingRef.current = false;
        onScrambleComplete?.();
      }
    }, speed * 1000);
  };

  useEffect(() => {
    if (!trigger) return;
    scramble();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <Component className={className} {...props}>
      {displayText}
    </Component>
  );
}
