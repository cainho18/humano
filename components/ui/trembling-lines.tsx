"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface TremblingLinesProps {
  className?: string;
  /** number of horizontal lines */
  lines?: number;
  color?: string;
  /** cursor influence radius in px */
  radius?: number;
  /** max vertical displacement in px */
  amplitude?: number;
}

/**
 * Straight horizontal lines that ripple/wobble where the cursor (or touch)
 * passes near, settling back to straight as it leaves. Canvas + rAF.
 */
export function TremblingLines({
  className,
  lines = 14,
  color = "#ff00aa",
  radius = 160,
  amplitude = 26,
}: TremblingLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const parent = canvas.parentElement!;
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    const move = (x: number, y: number) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = x - r.left;
      mouse.y = y - r.top;
    };
    const onMouse = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const tt = e.touches[0];
      if (tt) move(tt.clientX, tt.clientY);
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("mouseout", onLeave);

    const draw = () => {
      t += 0.05;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      const gap = h / (lines + 1);
      const step = 6;
      for (let li = 1; li <= lines; li++) {
        const baseY = gap * li;
        ctx.beginPath();
        for (let x = 0; x <= w; x += step) {
          const dx = x - mouse.x;
          const dy = baseY - mouse.y;
          const dist = Math.hypot(dx, dy);
          let off = 0;
          if (dist < radius) {
            const falloff = 1 - dist / radius;
            const wobble = reduced ? 0 : Math.sin(x * 0.05 + t) * 0.4 + 0.6;
            off = -Math.sign(dy || 1) * falloff * amplitude * wobble;
          }
          if (x === 0) ctx.moveTo(x, baseY + off);
          else ctx.lineTo(x, baseY + off);
        }
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [lines, color, radius, amplitude, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
}
