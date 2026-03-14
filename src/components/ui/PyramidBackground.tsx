"use client";

import React, { useRef, useEffect } from "react";

interface PyramidBackgroundProps {
  mode?: "light" | "dark";
  className?: string;
}

export default function PyramidBackground({ mode = "dark", className = "" }: PyramidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function draw() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const W = parent.clientWidth;
      const H = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      const ctx = canvas!.getContext("2d")!;
      ctx.scale(dpr, dpr);

      const S = 64;
      const half = S / 2;
      const cols = Math.ceil(W / S) + 2;
      const rows = Math.ceil(H / S) + 2;

      const colors = mode === "light"
        ? { top: "#e4e8ed", left: "#d0d5dc", right: "#a8aeb8", bottom: "#b8bec8", base: "#c8cdd5", ridge: "rgba(255,255,255,0.4)", valley: "rgba(0,0,0,0.06)" }
        : { top: "#2a2e38", left: "#242830", right: "#111418", bottom: "#181c22", base: "#1a1d24", ridge: "rgba(255,255,255,0.04)", valley: "rgba(0,0,0,0.3)" };

      ctx.fillStyle = colors.base;
      ctx.fillRect(0, 0, W, H);

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const cx = c * S + half;
          const cy = r * S + half;

          ctx.beginPath();
          ctx.moveTo(cx, cy - half); ctx.lineTo(cx + half, cy); ctx.lineTo(cx, cy); ctx.closePath();
          ctx.fillStyle = colors.top; ctx.fill();

          ctx.beginPath();
          ctx.moveTo(cx, cy - half); ctx.lineTo(cx - half, cy); ctx.lineTo(cx, cy); ctx.closePath();
          ctx.fillStyle = colors.left; ctx.fill();

          ctx.beginPath();
          ctx.moveTo(cx - half, cy); ctx.lineTo(cx, cy + half); ctx.lineTo(cx, cy); ctx.closePath();
          ctx.fillStyle = colors.bottom; ctx.fill();

          ctx.beginPath();
          ctx.moveTo(cx + half, cy); ctx.lineTo(cx, cy + half); ctx.lineTo(cx, cy); ctx.closePath();
          ctx.fillStyle = colors.right; ctx.fill();

          ctx.beginPath();
          ctx.moveTo(cx - half, cy); ctx.lineTo(cx, cy - half); ctx.lineTo(cx + half, cy);
          ctx.strokeStyle = colors.ridge; ctx.lineWidth = 0.5; ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cx - half, cy); ctx.lineTo(cx, cy + half); ctx.lineTo(cx + half, cy);
          ctx.strokeStyle = colors.valley; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-0 ${className}`}
      style={{ pointerEvents: "none" }}
    />
  );
}
