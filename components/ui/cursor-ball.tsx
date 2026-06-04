"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING = { mass: 0.1, damping: 18, stiffness: 220 };

const FINE_QUERY = "(pointer: fine)";
function subscribeFine(cb: () => void): () => void {
  const m = window.matchMedia(FINE_QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

/**
 * Bolinha #F2F2F2 que segue o cursor em todo o site (substitui o cursor padrão
 * em dispositivos com ponteiro fino). Some em toque / reduced-motion sem ponteiro.
 */
export function CursorBall() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const xs = useSpring(x, SPRING);
  const ys = useSpring(y, SPRING);
  const [visible, setVisible] = useState(false);
  // ponteiro fino (mouse/trackpad)? — sem setState-in-effect, sem mismatch SSR
  const enabled = useSyncExternalStore(
    subscribeFine,
    () => window.matchMedia(FINE_QUERY).matches,
    () => false
  );

  useEffect(() => {
    if (!enabled) return;

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, [x, y, enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-5 w-5 rounded-full bg-claro"
      style={{
        x: xs,
        y: ys,
        translateX: "-50%",
        translateY: "-50%",
        opacity: visible ? 1 : 0,
      }}
      transition={{ opacity: { duration: 0.2 } }}
    />
  );
}
