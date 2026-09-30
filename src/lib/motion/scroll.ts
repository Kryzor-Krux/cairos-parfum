import type Lenis from "lenis";

type SceneScroller = Pick<Lenis, "scrollTo">;
let activeScroller: SceneScroller | null = null;

/** The cleanup only removes its own instance, including during Strict Mode remounts. */
export function registerSceneScroller(scroller: SceneScroller) {
  activeScroller = scroller;
  return () => {
    if (activeScroller === scroller) activeScroller = null;
  };
}

export function scrollSceneTo(top: number, { immediate = false }: { immediate?: boolean } = {}) {
  if (typeof window === "undefined" || !Number.isFinite(top)) return;
  const instant = immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const target = Math.max(0, top);
  if (activeScroller) {
    // Preserve modal locks and let Lenis replace its own in-flight animation.
    // Numeric scene coordinates already include their intended position; no anchor offset applies.
    activeScroller.scrollTo(target, { immediate: instant, offset: 0 });
  } else {
    window.scrollTo({ top: target, behavior: instant ? "instant" : "smooth" });
  }
}

/** Lenis subtracts CSS scroll-padding itself for element/hash targets. */
export function anchorOffsetForPadding(scrollPadding: number, clearance = 84) {
  const padding = Number.isFinite(scrollPadding) ? Math.max(0, scrollPadding) : 0;
  return -Math.max(0, clearance - padding);
}
