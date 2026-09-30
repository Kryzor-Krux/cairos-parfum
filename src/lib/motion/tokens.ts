/** Shared by scene timelines (GSAP), UI transitions (Motion), and smooth scrolling. */
export const motionTokens = {
  ease: {
    editorial: [0.22, 1, 0.36, 1] as const,
    reveal: [0.16, 1, 0.3, 1] as const,
    interactive: [0.25, 0.1, 0.25, 1] as const,
  },
  gsap: {
    editorial: "power3.out",
    reveal: "power4.out",
    interactive: "power2.out",
  },
  duration: { quick: 0.22, interface: 0.38, reveal: 0.9, editorial: 1.2 },
  stagger: { words: 0.055, lines: 0.1 },
} as const;

export const smoothScrollEase = (progress: number) => 1 - Math.pow(1 - progress, 3);
