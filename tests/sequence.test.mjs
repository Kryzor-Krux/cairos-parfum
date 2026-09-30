import { test } from "node:test";
import assert from "node:assert/strict";
import { frameIndex, frameUrl, nearestFrame, preloadIndices, sequenceBudget, sequenceSource } from "../src/lib/motion/sequence.ts";

test("sequência prende os extremos do scroll aos frames existentes", () => {
  assert.equal(frameIndex(-0.5, 60), 0);
  assert.equal(frameIndex(0.5, 60), 30);
  assert.equal(frameIndex(1.5, 60), 59);
  assert.equal(frameIndex(Number.NaN, 60), 0);
  assert.equal(frameIndex(0.5, 0), 0);
});

test("manifest gera URLs locais sem solicitar frames inexistentes", () => {
  const manifest = { frameCount: 60, path: "/sequences/qahwa/{frame}.webp", pad: 4 };
  assert.equal(frameUrl(manifest, 0), "/sequences/qahwa/0001.webp");
  assert.equal(frameUrl(manifest, 59), "/sequences/qahwa/0060.webp");
  assert.equal(frameUrl(manifest, 60), null);
  assert.equal(frameUrl(manifest, -1), null);
  assert.equal(frameUrl(manifest, 0.5), null);
  assert.equal(frameUrl({ frameCount: 2, urls: ["/a.webp", "/b.webp"] }, 1), "/b.webp");
  assert.equal(frameUrl({ frameCount: 2 }, 1), null);
});

test("economia de dados, movimento reduzido e dispositivos limitados preservam o fallback", () => {
  for (const hint of [{ saveData: true }, { reducedMotion: true }, { effectiveType: "slow-2g" }, { effectiveType: "3g" }, { memory: 4 }]) {
    const budget = sequenceBudget(hint, 100);
    assert.equal(budget.enabled, false);
    assert.equal(budget.preloadFrames, 0);
    assert.equal(budget.memoryFrames, 0);
  }
  assert.equal(sequenceBudget({}, 0).enabled, false);
  assert.equal(sequenceBudget({}, 1).enabled, false);
});

test("mobile recebe variante própria, menos downloads, menos memória e DPR limitado", () => {
  const manifest = { frameCount: 72, path: "/desktop/{frame}.webp", mobile: { breakpoint: 768, frameCount: 36, path: "/mobile/{frame}.webp" } };
  assert.equal(sequenceSource(manifest, 390).frameCount, 36);
  assert.equal(sequenceSource(manifest, 768).frameCount, 72);
  const mobile = sequenceBudget({ mobile: true }, 36);
  const desktop = sequenceBudget({}, 72);
  assert.ok(mobile.preloadFrames < desktop.preloadFrames);
  assert.ok(mobile.memoryFrames < desktop.memoryFrames);
  assert.ok(mobile.maxDpr <= 1.5);
  assert.equal(mobile.concurrency, 1);
});

test("preload é único e limitado, com abertura e cobertura dos extremos da cena", () => {
  const frames = preloadIndices(72, 8);
  assert.equal(frames.length, 8);
  assert.equal(new Set(frames).size, 8);
  assert.deepEqual(frames.slice(0, 3), [0, 1, 2]);
  assert.ok(frames.includes(71));
  assert.ok(frames.every((index) => index >= 0 && index < 72));
  assert.deepEqual(preloadIndices(2, 8), [0, 1]);
  assert.deepEqual(preloadIndices(72, 0), []);
  assert.equal(nearestFrame(24, [0, 10, 28, 50]), 28);
  assert.equal(nearestFrame(24, []), null);
});
