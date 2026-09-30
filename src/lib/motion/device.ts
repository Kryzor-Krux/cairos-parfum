export type ConnectionHints = EventTarget & {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
};

export type MotionNavigator = Navigator & {
  connection?: ConnectionHints;
  deviceMemory?: number;
};

export function readDeviceHints() {
  const device = navigator as MotionNavigator;
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: device.connection?.saveData ?? false,
    effectiveType: device.connection?.effectiveType,
    memory: device.deviceMemory,
    mobile: window.matchMedia("(max-width: 767px), (pointer: coarse)").matches,
  };
}

export function onIdle(callback: () => void, timeout = 900) {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = globalThis.setTimeout(callback, 100);
  return () => globalThis.clearTimeout(id);
}
