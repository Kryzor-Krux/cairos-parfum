import { test } from "node:test";
import assert from "node:assert/strict";
import { anchorOffsetForPadding, registerSceneScroller, scrollSceneTo } from "../src/lib/motion/scroll.ts";

test("navegação de cena usa uma só implementação de scroll e respeita movimento reduzido", () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  const nativeCalls = [];
  const lenisCalls = [];
  let reduced = false;
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    matchMedia: () => ({ matches: reduced }),
    scrollTo: (options) => nativeCalls.push(options),
  } });
  let unregister;
  try {
    scrollSceneTo(300);
    assert.deepEqual(nativeCalls, [{ top: 300, behavior: "smooth" }]);
    reduced = true;
    scrollSceneTo(-20);
    assert.deepEqual(nativeCalls.at(-1), { top: 0, behavior: "instant" });

    unregister = registerSceneScroller({ scrollTo: (...args) => lenisCalls.push(args) });
    scrollSceneTo(740);
    assert.deepEqual(lenisCalls.at(-1), [740, { immediate: true, offset: 0 }]);
    assert.equal(nativeCalls.length, 2);
    reduced = false;
    scrollSceneTo(810);
    assert.deepEqual(lenisCalls.at(-1), [810, { immediate: false, offset: 0 }]);
    scrollSceneTo(920, { immediate: true });
    assert.deepEqual(lenisCalls.at(-1), [920, { immediate: true, offset: 0 }]);
    scrollSceneTo(Number.NaN);
    assert.equal(lenisCalls.length, 3);

    unregister();
    scrollSceneTo(1000, { immediate: true });
    assert.deepEqual(nativeCalls.at(-1), { top: 1000, behavior: "instant" });
  } finally {
    unregister?.();
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else delete globalThis.window;
  }
});

test("cleanup antigo não remove a instância de scroll que o substituiu", () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  const calls = [];
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    matchMedia: () => ({ matches: false }),
    scrollTo: () => assert.fail("não deveria usar scroll nativo"),
  } });
  const unregisterFirst = registerSceneScroller({ scrollTo: () => assert.fail("instância antiga") });
  const unregisterSecond = registerSceneScroller({ scrollTo: (...args) => calls.push(args) });
  try {
    unregisterFirst();
    scrollSceneTo(350);
    assert.equal(calls[0][0], 350);
  } finally {
    unregisterSecond();
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else delete globalThis.window;
  }
});

test("anchors não duplicam os 84 px já reservados pelo CSS", () => {
  assert.equal(Math.abs(anchorOffsetForPadding(84)), 0);
  assert.equal(anchorOffsetForPadding(75), -9);
  assert.equal(anchorOffsetForPadding(0), -84);
  assert.equal(Math.abs(anchorOffsetForPadding(100)), 0);
  assert.equal(anchorOffsetForPadding(Number.NaN), -84);
});
