"use client";

import { useEffect } from "react";
import "lenis/dist/lenis.css";
import "./runtime.css";
import { loadGsap } from "@/lib/motion/runtime";
import { onIdle, type MotionNavigator } from "@/lib/motion/device";
import { smoothScrollEase } from "@/lib/motion/tokens";
import { anchorOffsetForPadding, registerSceneScroller } from "@/lib/motion/scroll";

/** Touch devices keep their native scroll; GSAP scenes work with either mode. */
export function MotionRuntime() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as MotionNavigator).connection;
    let revision = 0;
    let disposed = false;
    let destroyRuntime: (() => void) | undefined;
    let cancelIdle: (() => void) | undefined;

    const configure = () => {
      const current = ++revision;
      cancelIdle?.();
      destroyRuntime?.();
      destroyRuntime = undefined;
      if (!desktop.matches || reduced.matches || connection?.saveData ||
        /(^|-)2g$|3g/.test(connection?.effectiveType ?? "")) return;

      cancelIdle = onIdle(() => {
        void Promise.all([import("lenis"), loadGsap()]).then(([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
          if (disposed || current !== revision) return;
          const scrollPadding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
          const lenis = new Lenis({
            autoRaf: false,
            duration: 0.85,
            easing: smoothScrollEase,
            smoothWheel: true,
            syncTouch: false,
            // Current Lenis already reads CSS scroll-padding; do not apply the header offset twice.
            anchors: { offset: anchorOffsetForPadding(scrollPadding) },
            prevent: (node) => Boolean(node.closest("dialog, [data-native-scroll], [data-lenis-prevent]")),
          });
          const unregisterScroller = registerSceneScroller(lenis);
          const update = () => ScrollTrigger.update();
          // GSAP ticks in seconds; Lenis consumes milliseconds. One clock avoids RAF drift.
          const tick = (time: number) => lenis.raf(time * 1000);
          lenis.on("scroll", update);
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);

          let locked = false;
          const syncLock = () => {
            const overflow = getComputedStyle(document.body).overflow;
            const next = /hidden|clip/.test(overflow) || Boolean(document.querySelector("dialog[open]"));
            if (next === locked) return;
            locked = next;
            if (locked) lenis.stop();
            else lenis.start();
          };
          const bodyObserver = new MutationObserver(syncLock);
          bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });
          const dialogObserver = new MutationObserver(syncLock);
          dialogObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"], childList: true });
          syncLock();
          ScrollTrigger.refresh();
          destroyRuntime = () => {
            unregisterScroller();
            bodyObserver.disconnect();
            dialogObserver.disconnect();
            lenis.off("scroll", update);
            gsap.ticker.remove(tick);
            gsap.ticker.lagSmoothing(500, 33);
            lenis.destroy();
          };
        }).catch(() => {
          // Native scrolling remains fully usable if an optional enhancement fails to load.
        });
      });
    };

    configure();
    desktop.addEventListener("change", configure);
    reduced.addEventListener("change", configure);
    connection?.addEventListener("change", configure);
    return () => {
      disposed = true;
      revision++;
      cancelIdle?.();
      destroyRuntime?.();
      desktop.removeEventListener("change", configure);
      reduced.removeEventListener("change", configure);
      connection?.removeEventListener("change", configure);
    };
  }, []);
  return null;
}
