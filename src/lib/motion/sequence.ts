export type SequenceSource = {
  frameCount: number;
  /** Relative to public, for example /sequences/qahwa/desktop/{frame}.webp. */
  path?: string;
  urls?: readonly string[];
  startFrame?: number;
  pad?: number;
};

export type SequenceManifest = SequenceSource & {
  mobile?: SequenceSource & { breakpoint?: number };
};

export type DeviceHints = {
  reducedMotion?: boolean;
  saveData?: boolean;
  effectiveType?: string;
  memory?: number;
  mobile?: boolean;
};

export function frameIndex(progress: number, frameCount: number) {
  if (!Number.isFinite(progress) || frameCount < 2) return 0;
  return Math.round(Math.min(1, Math.max(0, progress)) * (Math.floor(frameCount) - 1));
}

export function sequenceSource(manifest: SequenceManifest, viewportWidth: number): SequenceSource {
  return manifest.mobile && viewportWidth < (manifest.mobile.breakpoint ?? 768)
    ? manifest.mobile
    : manifest;
}

export function frameUrl(source: SequenceSource, index: number) {
  if (!Number.isInteger(index) || index < 0 || index >= source.frameCount) return null;
  if (source.urls) return source.urls[index] ?? null;
  if (!source.path?.includes("{frame}")) return null;
  const number = String(index + (source.startFrame ?? 1)).padStart(Math.min(8, Math.max(0, source.pad ?? 4)), "0");
  return source.path.replace("{frame}", number);
}

export function sequenceBudget(hints: DeviceHints, frameCount: number) {
  const limited = hints.reducedMotion || hints.saveData ||
    /(^|-)2g$|3g/.test(hints.effectiveType ?? "") ||
    (hints.memory !== undefined && hints.memory <= 4);
  const enabled = !limited && Number.isInteger(frameCount) && frameCount > 1;
  return {
    enabled,
    preloadFrames: enabled ? Math.min(frameCount, hints.mobile ? 8 : 16) : 0,
    memoryFrames: enabled ? Math.min(frameCount, hints.mobile ? 12 : 20) : 0,
    concurrency: hints.mobile ? 1 : 2,
    maxDpr: hints.mobile ? 1.5 : 1.75,
    decodeSize: hints.mobile ? 640 : 768,
  };
}

/** Start with adjacent frames, then distribute the remaining budget over the whole scene. */
export function preloadIndices(frameCount: number, budget: number) {
  const count = Math.max(0, Math.min(Math.floor(budget), Math.floor(frameCount)));
  if (!count) return [];
  const indices = new Set<number>([0]);
  for (let i = 1; i < Math.min(3, count); i++) indices.add(i);
  const remaining = count - indices.size;
  for (let i = 1; i <= remaining; i++) indices.add(Math.round((i / remaining) * (frameCount - 1)));
  for (let i = 0; indices.size < count; i++) indices.add(i);
  return [...indices];
}

export function nearestFrame(target: number, indices: readonly number[]) {
  let nearest: number | null = null;
  for (const index of indices) {
    if (nearest === null || Math.abs(index - target) < Math.abs(nearest - target)) nearest = index;
  }
  return nearest;
}
