"use client";

import { FC, ReactNode, useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";

interface TextRevealByWordProps {
  text: string;
  className?: string;
}

/**
 * Word-by-word fade-in driven by scroll. Lives in a tall container; the text
 * sticks while it reveals. Colour inherits from the parent (use text-claro /
 * text-preto). The dim layer sits behind at low opacity.
 */
export const TextRevealByWord: FC<TextRevealByWordProps> = ({
  text,
  className,
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const words = text.split(" ");

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[200vh]", className)}>
      <div className="sticky top-0 mx-auto flex h-screen max-w-4xl items-center px-6 py-20">
        <p className="flex flex-wrap text-2xl font-medium leading-relaxed md:text-3xl lg:text-4xl">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mx-1 lg:mx-1.5">
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};
