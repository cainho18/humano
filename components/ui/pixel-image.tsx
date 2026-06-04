"use client";

import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface PixelImageProps {
  src: string;
  alt?: string;
  className?: string;
  /** tamanho do bloco máximo (mais pixelado) quando fora de vista */
  maxBlock?: number;
}

/**
 * Imagem que começa pixelada e vai ganhando resolução conforme o scroll a traz
 * pro centro da tela (PIXELATED SCROLL TRANSITION). Canvas + image-smoothing off.
 */
export function PixelImage({
  src,
  alt = "",
  className,
  maxBlock = 26,
}: PixelImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "center center"],
  });

  const draw = () => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!canvas || !wrap || !img) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = wrap.clientWidth;
    const H = wrap.clientHeight;
    if (W === 0 || H === 0) return;
    if (canvas.width !== W * dpr) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const p = reduced ? 1 : Math.min(1, Math.max(0, progress.current));
    // bloco grande (pixelado) → 1px (nítido)
    const block = Math.max(1, Math.round(maxBlock - (maxBlock - 1) * p));

    const off = offRef.current!;
    const sw = Math.max(1, Math.ceil((W * dpr) / block));
    const sh = Math.max(1, Math.ceil((H * dpr) / block));
    off.width = sw;
    off.height = sh;
    const octx = off.getContext("2d")!;

    // cover-fit a imagem no buffer pequeno
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const targetAspect = sw / sh;
    const imgAspect = iw / ih;
    let dx = 0,
      dy = 0,
      dw = sw,
      dh = sh;
    if (imgAspect > targetAspect) {
      dw = sh * imgAspect;
      dx = (sw - dw) / 2;
    } else {
      dh = sw / imgAspect;
      dy = (sh - dh) / 2;
    }
    octx.clearRect(0, 0, sw, sh);
    octx.drawImage(img, dx, dy, dw, dh);

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(off, 0, 0, sw, sh, 0, 0, canvas.width, canvas.height);
  };

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    requestAnimationFrame(draw);
  });

  useEffect(() => {
    const off = document.createElement("canvas");
    offRef.current = off;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      draw();
    };
    img.src = src;

    const ro = new ResizeObserver(() => draw());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative aspect-square w-full overflow-hidden", className)}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <span className="sr-only">{alt}</span>
    </div>
  );
}
