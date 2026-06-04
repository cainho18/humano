"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface TremblingLinesProps {
  className?: string;
  /** número de cordas (= número de áudios) */
  lines?: number;
  color?: string;
  amplitude?: number;
  /** caminho base dos áudios: `${audioBase}${i}.mp3`, i de 1..lines */
  audioBase?: string;
}

/**
 * Cordas horizontais. SÓ a corda sob o cursor se movimenta; as outras ficam
 * retas. Cada corda toca um áudio em loop ao passar o cursor (para ao sair,
 * troca ao mudar de corda). Canvas + rAF + <audio> por corda.
 */
export function TremblingLines({
  className,
  lines = 12,
  color = "#ff00aa",
  amplitude = 22,
  audioBase = "/audio/corda-",
}: TremblingLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const audiosRef = useRef<HTMLAudioElement[]>([]);
  const activeRef = useRef<number>(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const parent = canvas.parentElement!;
    const mouse = { x: -9999, y: -9999, inside: false };
    let raf = 0;
    let t = 0;

    // áudios (um por corda)
    const audios: HTMLAudioElement[] = [];
    for (let i = 0; i < lines; i++) {
      const a = new Audio(`${audioBase}${i + 1}.mp3`);
      a.loop = true;
      a.preload = "none";
      a.volume = 0.7;
      audios.push(a);
    }
    audiosRef.current = audios;

    const setActive = (idx: number) => {
      if (activeRef.current === idx) return;
      const prev = activeRef.current;
      if (prev >= 0 && audios[prev]) {
        audios[prev].pause();
        audios[prev].currentTime = 0;
      }
      activeRef.current = idx;
      if (idx >= 0 && audios[idx]) {
        audios[idx].currentTime = 0;
        audios[idx].play().catch(() => {});
      }
    };

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
      mouse.inside =
        mouse.x >= 0 &&
        mouse.x <= r.width &&
        mouse.y >= 0 &&
        mouse.y <= r.height;
    };
    const onMouse = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const tt = e.touches[0];
      if (tt) move(tt.clientX, tt.clientY);
    };
    const onLeave = () => {
      mouse.inside = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("mouseout", onLeave);

    const draw = () => {
      t += 0.06;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const gap = h / (lines + 1);
      const step = 6;

      // qual corda está sob o cursor (faixa de ±gap/2)
      let active = -1;
      if (mouse.inside) {
        const nearest = Math.round(mouse.y / gap); // 1..lines
        if (
          nearest >= 1 &&
          nearest <= lines &&
          Math.abs(mouse.y - gap * nearest) < gap * 0.5
        ) {
          active = nearest - 1; // 0-based
        }
      }
      setActive(active);

      for (let li = 1; li <= lines; li++) {
        const idx = li - 1;
        const baseY = gap * li;
        const isActive = idx === active && !reduced;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = isActive ? 2.4 : 1.4;
        ctx.globalAlpha = isActive ? 1 : 0.5;
        for (let x = 0; x <= w; x += step) {
          let off = 0;
          if (isActive) {
            // onda viajante na corda toda, mais forte perto do cursor
            const env = Math.exp(-((x - mouse.x) ** 2) / (2 * 220 * 220));
            off =
              Math.sin(x * 0.045 - t * 2) * amplitude * (0.45 + 0.55 * env);
          }
          if (x === 0) ctx.moveTo(x, baseY + off);
          else ctx.lineTo(x, baseY + off);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseout", onLeave);
      audios.forEach((a) => {
        a.pause();
        a.src = "";
      });
    };
  }, [lines, color, amplitude, audioBase, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
}
