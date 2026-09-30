"use client";

import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { onIdle, readDeviceHints, type MotionNavigator } from "@/lib/motion/device";
import {
  frameIndex,
  frameUrl,
  nearestFrame,
  preloadIndices,
  sequenceBudget,
  sequenceSource,
  type SequenceManifest,
} from "@/lib/motion/sequence";

export type ImageSequenceHandle = { seek: (progress: number) => void };

export type ImageSequenceProps = {
  manifest?: SequenceManifest;
  fallback: { src: string; alt: string; width?: number; height?: number; sizes?: string };
  className?: string;
  fit?: "cover" | "contain";
};

type DecodedFrame = {
  image: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
};

async function decodeFrame(blob: Blob, resizeWidth: number): Promise<DecodedFrame> {
  if ("createImageBitmap" in window) {
    try {
      const image = await createImageBitmap(blob, { resizeWidth, resizeQuality: "medium" });
      return { image, width: image.width, height: image.height, release: () => image.close() };
    } catch {
      // Safari versions without bitmap resize support can still use the same canvas scene.
    }
  }
  const objectUrl = URL.createObjectURL(blob);
  const image = new window.Image();
  try {
    image.src = objectUrl;
    await image.decode();
    return { image, width: image.naturalWidth, height: image.naturalHeight, release: () => { image.src = ""; } };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/** The parent scene owns scroll. seek() draws directly; it never renders React per frame. */
export const ImageSequence = forwardRef<ImageSequenceHandle, ImageSequenceProps>(function ImageSequence(
  { manifest, fallback, className = "", fit = "cover" },
  ref,
) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fallbackLayer = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const seek = useRef<(value: number) => void>(() => {});

  useImperativeHandle(ref, () => ({
    seek(value) {
      progress.current = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
      seek.current(progress.current);
    },
  }), []);

  useEffect(() => {
    const container = root.current;
    const surface = canvas.current;
    const fallbackElement = fallbackLayer.current;
    if (!container || !surface || !fallbackElement) return;
    surface.style.opacity = "0";
    fallbackElement.style.opacity = "1";
    container.dataset.sequence = "fallback";
    if (!manifest) return;
    const context = surface.getContext("2d", { alpha: true });
    if (!context) return;
    const mobile = window.matchMedia(`(max-width: ${(manifest.mobile?.breakpoint ?? 768) - 1}px)`);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as MotionNavigator).connection;
    let stop: (() => void) | undefined;

    const configure = () => {
      stop?.();
      surface.style.opacity = "0";
      fallbackElement.style.opacity = "1";
      container.dataset.sequence = "fallback";
      const source = sequenceSource(manifest, window.innerWidth);
      const budget = sequenceBudget(readDeviceHints(), source.frameCount);
      if (!budget.enabled || !frameUrl(source, 0)) return;

      let disposed = false;
      let nearViewport = false;
      let animationFrame = 0;
      let activeRequests = 0;
      let drawn = -1;
      let sizeChanged = true;
      let cancelIdle: (() => void) | undefined;
      let idleScheduled = false;
      const loaded = new Map<number, DecodedFrame>();
      const requests = new Map<number, AbortController>();
      const failed = new Set<number>();
      const prefetch = preloadIndices(source.frameCount, budget.preloadFrames);
      const desired = () => frameIndex(progress.current, source.frameCount);

      const draw = () => {
        animationFrame = 0;
        if (disposed) return;
        const index = nearestFrame(desired(), [...loaded.keys()]);
        if (index === null || (drawn === index && !sizeChanged)) return;
        const frame = loaded.get(index)!;
        const rect = container.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const ratio = Math.min(window.devicePixelRatio || 1, budget.maxDpr);
        const width = Math.max(1, Math.round(rect.width * ratio));
        const height = Math.max(1, Math.round(rect.height * ratio));
        if (surface.width !== width || surface.height !== height) {
          surface.width = width;
          surface.height = height;
        }
        const scale = fit === "cover"
          ? Math.max(width / frame.width, height / frame.height)
          : Math.min(width / frame.width, height / frame.height);
        const imageWidth = frame.width * scale;
        const imageHeight = frame.height * scale;
        context.clearRect(0, 0, width, height);
        context.drawImage(frame.image, (width - imageWidth) / 2, (height - imageHeight) / 2, imageWidth, imageHeight);
        surface.style.opacity = "1";
        fallbackElement.style.opacity = "0";
        container.dataset.sequence = "ready";
        drawn = index;
        sizeChanged = false;
      };

      const requestDraw = () => {
        if (!animationFrame) animationFrame = requestAnimationFrame(draw);
      };

      const pruneCache = (keep: number) => {
        while (loaded.size > budget.memoryFrames) {
          let farthest = -1;
          for (const index of loaded.keys()) {
            if (index !== keep && (farthest === -1 || Math.abs(index - desired()) > Math.abs(farthest - desired()))) farthest = index;
          }
          if (farthest === -1) break;
          loaded.get(farthest)?.release();
          loaded.delete(farthest);
        }
      };

      const schedule = () => {
        if (disposed || !nearViewport || idleScheduled || activeRequests >= budget.concurrency) return;
        idleScheduled = true;
        cancelIdle = onIdle(() => {
          idleScheduled = false;
          if (disposed || !nearViewport) return;
          const urgent = desired();
          if (!loaded.has(urgent) && !requests.has(urgent) && !failed.has(urgent)) load(urgent);
          while (activeRequests < budget.concurrency && prefetch.length) {
            const index = prefetch.shift()!;
            if (!loaded.has(index) && !requests.has(index) && !failed.has(index)) load(index);
          }
        }, 500);
      };

      const load = (index: number) => {
        const url = frameUrl(source, index);
        if (!url) { failed.add(index); return; }
        const controller = new AbortController();
        requests.set(index, controller);
        activeRequests++;
        void fetch(url, { signal: controller.signal, cache: "force-cache" })
          .then((response) => {
            if (!response.ok) throw new Error("Sequence frame unavailable");
            return response.blob();
          })
          .then((blob) => decodeFrame(blob, budget.decodeSize))
          .then((frame) => {
            if (disposed) { frame.release(); return; }
            loaded.set(index, frame);
            pruneCache(index);
            requestDraw();
          })
          .catch(() => { if (!disposed) failed.add(index); })
          .finally(() => {
            requests.delete(index);
            activeRequests--;
            schedule();
          });
      };

      seek.current = () => { requestDraw(); schedule(); };
      const observer = new IntersectionObserver(([entry]) => {
        nearViewport = entry.isIntersecting;
        if (nearViewport) {
          // Only the opening frame starts immediately; every other download waits for idle time.
          if (!loaded.size && !requests.size && !failed.has(0)) load(0);
          schedule();
        }
      }, { rootMargin: "600px 0px" });
      observer.observe(container);
      const resize = new ResizeObserver(() => { sizeChanged = true; requestDraw(); });
      resize.observe(container);

      stop = () => {
        disposed = true;
        seek.current = () => {};
        observer.disconnect();
        resize.disconnect();
        cancelIdle?.();
        cancelAnimationFrame(animationFrame);
        requests.forEach((controller) => controller.abort());
        loaded.forEach((frame) => frame.release());
        loaded.clear();
        context.clearRect(0, 0, surface.width, surface.height);
        surface.style.opacity = "0";
        fallbackElement.style.opacity = "1";
        container.dataset.sequence = "fallback";
      };
    };

    configure();
    mobile.addEventListener("change", configure);
    reduced.addEventListener("change", configure);
    connection?.addEventListener("change", configure);
    return () => {
      stop?.();
      mobile.removeEventListener("change", configure);
      reduced.removeEventListener("change", configure);
      connection?.removeEventListener("change", configure);
    };
  }, [manifest, fit]);

  return <div ref={root} className={`image-sequence ${className}`} data-sequence="fallback" style={{ position: "relative", width: "100%", height: "100%" }}>
    <div ref={fallbackLayer} style={{ position: "absolute", inset: 0 }}>
      <Image src={fallback.src} alt={fallback.alt} fill sizes={fallback.sizes ?? "(max-width: 767px) 100vw, 65vw"} style={{ objectFit: fit }} />
    </div>
    <canvas ref={canvas} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, pointerEvents: "none" }} />
  </div>;
});
