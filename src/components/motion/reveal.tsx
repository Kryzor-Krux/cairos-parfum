"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { loadGsap } from "@/lib/motion/runtime";
import { motionTokens } from "@/lib/motion/tokens";
import styles from "./reveal.module.css";

function useReveal(mode: "words" | "lines" | "image", delay: number) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Content already in view stays visible: delayed library loads never make it disappear.
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    let disposed = false;
    let revert: (() => void) | undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void loadGsap().then(({ gsap }) => {
        if (disposed || reduced.matches || element.getBoundingClientRect().top < window.innerHeight) return;
        const context = gsap.context(() => {
          if (mode === "image") {
            gsap.fromTo(element, { clipPath: "inset(7% 3% 7% 3%)" }, {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: motionTokens.duration.editorial,
              ease: motionTokens.gsap.reveal,
              delay,
              scrollTrigger: { trigger: element, start: "top 96%", once: true },
            });
          } else {
            gsap.fromTo(element.querySelectorAll("[data-reveal-piece]"), { yPercent: 108 }, {
              yPercent: 0,
              duration: motionTokens.duration.reveal,
              stagger: motionTokens.stagger[mode],
              ease: motionTokens.gsap.reveal,
              delay,
              scrollTrigger: { trigger: element, start: "top 94%", once: true },
            });
          }
        }, element);
        revert = () => context.revert();
      }).catch(() => {});
    }, { rootMargin: "240px 0px" });
    observer.observe(element);
    const onReduced = () => { if (reduced.matches) { observer.disconnect(); revert?.(); } };
    reduced.addEventListener("change", onReduced);
    return () => { disposed = true; observer.disconnect(); revert?.(); reduced.removeEventListener("change", onReduced); };
  }, [mode, delay]);
  return ref;
}

type RevealTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div" | "span";
  split?: "words" | "lines";
  className?: string;
  delay?: number;
  id?: string;
};

export function RevealText({ text, as: Tag = "h2", split = "words", className = "", delay = 0, id }: RevealTextProps) {
  const ref = useReveal(split, delay);
  const pieces = split === "lines" ? text.split("\n") : text.split(/\s+/);
  return <Tag ref={ref as React.Ref<HTMLHeadingElement>} id={id} className={className}>
    {pieces.map((piece, index) => <span key={`${piece}-${index}`}>
      <span className={split === "lines" ? styles.lineMask : styles.wordMask}><span data-reveal-piece className={styles.piece}>{piece}</span></span>
      {split === "words" && index < pieces.length - 1 ? " " : null}
    </span>)}
  </Tag>;
}

export function RevealImage({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useReveal("image", delay);
  return <div ref={ref as React.Ref<HTMLDivElement>} className={className}>{children}</div>;
}
