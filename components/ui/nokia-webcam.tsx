"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type NokiaColor = "#FF00AA" | "#FFFF00";
const LIGHT = [242, 242, 242] as const; // #F2F2F2

interface NokiaWebcamProps {
  className?: string;
  children?: React.ReactNode;
  defaultColor?: NokiaColor;
}

/**
 * Full-bleed webcam with a retro two-colour bitmap look (Floyd-Steinberg
 * dithering at displaySize/6, painted as solid 6×6 blocks). If camera access
 * is denied/unavailable, falls back to a static field in the chosen colour.
 */
export function NokiaWebcam({
  className,
  children,
  defaultColor = "#FF00AA",
}: NokiaWebcamProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [bg, setBg] = useState<NokiaColor>(defaultColor);
  const [denied, setDenied] = useState(false);
  const bgRef = useRef<NokiaColor>(defaultColor);

  useEffect(() => {
    bgRef.current = bg;
  }, [bg]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    const isMobile =
      typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    videoRef.current = video;

    const sample = document.createElement("canvas");
    const sctx = sample.getContext("2d", { willReadFrequently: true })!;

    const BLOCK = 6;

    const render = () => {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap || video.readyState < 2) {
        raf = requestAnimationFrame(render);
        return;
      }
      const W = wrap.clientWidth;
      const H = wrap.clientHeight;
      if (canvas.width !== W) canvas.width = W;
      if (canvas.height !== H) canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      const cols = Math.max(1, Math.ceil(W / BLOCK));
      const rows = Math.max(1, Math.ceil(H / BLOCK));
      sample.width = cols;
      sample.height = rows;

      // cover-crop the video into the low-res sample buffer
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const targetAspect = cols / rows;
      const videoAspect = vw / vh;
      let sx = 0;
      let sy = 0;
      let sw = vw;
      let sh = vh;
      if (videoAspect > targetAspect) {
        sw = vh * targetAspect;
        sx = (vw - sw) / 2;
      } else {
        sh = vw / targetAspect;
        sy = (vh - sh) / 2;
      }

      sctx.save();
      if (!isMobile) {
        sctx.translate(cols, 0);
        sctx.scale(-1, 1); // mirror front camera on desktop
      }
      sctx.drawImage(video, sx, sy, sw, sh, 0, 0, cols, rows);
      sctx.restore();

      const img = sctx.getImageData(0, 0, cols, rows);
      const d = img.data;
      const gray = new Float32Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) {
        const r = d[i * 4];
        const g = d[i * 4 + 1];
        const b = d[i * 4 + 2];
        gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
      }

      // Floyd-Steinberg dithering, threshold 120
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          const old = gray[idx];
          const nv = old < 120 ? 0 : 255;
          const err = old - nv;
          gray[idx] = nv;
          if (x + 1 < cols) gray[idx + 1] += (err * 7) / 16;
          if (y + 1 < rows) {
            if (x > 0) gray[idx + cols - 1] += (err * 3) / 16;
            gray[idx + cols] += (err * 5) / 16;
            if (x + 1 < cols) gray[idx + cols + 1] += (err * 1) / 16;
          }
        }
      }

      // paint solid BLOCK×BLOCK cells into a full-res ImageData
      const out = ctx.createImageData(W, H);
      const od = out.data;
      const c = bgRef.current;
      const bgRGB = c === "#FF00AA" ? [255, 0, 170] : [255, 255, 0];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const on = gray[y * cols + x] >= 128; // light pixel
          const rgb = on ? LIGHT : bgRGB;
          const px0 = x * BLOCK;
          const py0 = y * BLOCK;
          for (let by = 0; by < BLOCK; by++) {
            const yy = py0 + by;
            if (yy >= H) break;
            for (let bx = 0; bx < BLOCK; bx++) {
              const xx = px0 + bx;
              if (xx >= W) break;
              const o = (yy * W + xx) * 4;
              od[o] = rgb[0];
              od[o + 1] = rgb[1];
              od[o + 2] = rgb[2];
              od[o + 3] = 255;
            }
          }
        }
      }
      ctx.putImageData(out, 0, 0);
      raf = requestAnimationFrame(render);
    };

    navigator.mediaDevices
      ?.getUserMedia({
        video: { facingMode: isMobile ? "environment" : "user" },
        audio: false,
      })
      .then((s) => {
        stream = s;
        video.srcObject = s;
        return video.play();
      })
      .then(() => {
        raf = requestAnimationFrame(render);
      })
      .catch(() => setDenied(true));

    return () => {
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn("relative h-full w-full overflow-hidden bg-rosa", className)}
    >
      {!denied && (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      )}

      {/* HUD */}
      <div className="pointer-events-none absolute inset-0 z-10 font-mono text-claro">
        <span className="absolute left-3 top-3 text-xs tracking-widest">
          ▮▮▮ HUMANWARE CAM
        </span>
        <div className="pointer-events-auto absolute right-3 top-3 flex gap-2">
          {(["#FF00AA", "#FFFF00"] as NokiaColor[]).map((c) => (
            <button
              key={c}
              aria-label={`cor ${c}`}
              onClick={() => setBg(c)}
              className={cn(
                "h-4 w-4 rounded-full border",
                bg === c ? "border-claro" : "border-claro/40"
              )}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-20 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
