"use client";

import { useEffect, useRef, useState } from "react";

import { createWineStage } from "@/studio/renderer";

export function WineStage({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !("gpu" in navigator)) return;

    let cancelled = false;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage = createWineStage(canvas, { still });
    const observer = new IntersectionObserver(
      ([entry]) => stage.setRunning(entry?.isIntersecting ?? false),
      { threshold: 0 },
    );
    observer.observe(canvas);

    stage.ready
      .then(() => {
        if (!cancelled) setLive(true);
      })
      .catch((error: unknown) => {
        console.warn("Cata's WebGPU stage could not start; showing the still instead.", error);
      });

    return () => {
      cancelled = true;
      observer.disconnect();
      stage.dispose();
    };
  }, []);

  return (
    <div className={`overflow-hidden bg-ink ${className}`} aria-hidden="true">
      <div className="stage-poster absolute inset-0" />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 block h-full w-full transition-opacity duration-[1400ms] ease-out ${
          live ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
