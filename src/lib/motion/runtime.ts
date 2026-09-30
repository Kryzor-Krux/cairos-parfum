export { scrollSceneTo } from "./scroll";

type GsapRuntime = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let runtime: Promise<GsapRuntime> | undefined;

/** Import scene tools once, only when a client scene actually needs them. */
export function loadGsap(): Promise<GsapRuntime> {
  if (!runtime) {
    runtime = Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });
        return { gsap, ScrollTrigger };
      })
      .catch((error: unknown) => {
        runtime = undefined;
        throw error;
      });
  }
  return runtime;
}
