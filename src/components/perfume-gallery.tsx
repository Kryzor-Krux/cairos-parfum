"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { perfumes, type Perfume } from "@/data/perfumes";
import { productMessage } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";
import { loadGsap } from "@/lib/motion/runtime";
import { scrollSceneTo } from "@/lib/motion/scroll";
import { ContactButton } from "@/components/experience";

const atmospheres = [
  { word: "Intenso", signature: "Café. Especiarias. Pele.", mood: "O calor das especiarias. A profundidade do café. Um convite para ficar.", setting: "Um encontro ao anoitecer" },
  { word: "Livre", signature: "Cítricos. Cedro. Horizonte.", mood: "Cítricos que iluminam. Madeiras que acolhem. Como abrir as janelas para um novo dia.", setting: "Luz que atravessa o dia" },
  { word: "Magnético", signature: "Flores. Cacau. Mistério.", mood: "A delicadeza das flores encontra a densidade do cacau. Um contraste que aproxima.", setting: "Entre a luz e o mistério" },
  { word: "Singular", signature: "Abacaxi. Oud. Contraste.", mood: "A luminosidade do abacaxi encontra a profundidade do oud. O inesperado deixa presença.", setting: "A beleza do contraste" },
];

const phases = [
  { key: "top", label: "Abertura", caption: "O primeiro encontro" },
  { key: "heart", label: "Coração", caption: "O que se revela" },
  { key: "base", label: "Fundo", caption: "O que permanece" },
] as const;

function FragranceNotes({ perfume, reduced }: { perfume: Perfume; reduced: boolean | null }) {
  const [phase, setPhase] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % phases.length;
    else if (event.key === "ArrowLeft") next = (index + phases.length - 1) % phases.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = phases.length - 1;
    else return;
    event.preventDefault();
    setPhase(next);
    tabs.current[next]?.focus();
  }

  return (
    <details className="gallery-notes">
      <summary className="gallery-notes-toggle"><span>Dentro da fragrância <small>Explore as notas</small></span><Plus size={19} aria-hidden="true" /></summary>
      <div className="gallery-notes-content">
        <div className="gallery-note-tabs" role="tablist" aria-label={`Notas de ${perfume.name}`}>
          {phases.map((item, index) => (
            <motion.button key={item.key} ref={(element) => { tabs.current[index] = element; }} id={`gallery-tab-${perfume.id}-${item.key}`} type="button" role="tab" aria-selected={phase === index} aria-controls={`gallery-panel-${perfume.id}-${item.key}`} tabIndex={phase === index ? 0 : -1} onClick={() => setPhase(index)} onKeyDown={(event) => handleTabKey(event, index)} whileTap={reduced ? undefined : { scale: 0.97 }}>
              {item.label}
              {phase === index && <motion.span className="gallery-tab-line" layoutId={`gallery-note-line-${perfume.id}`} transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }} />}
            </motion.button>
          ))}
        </div>
        {phases.map((item, index) => (
          <div key={item.key} id={`gallery-panel-${perfume.id}-${item.key}`} className="gallery-note-panel" role="tabpanel" aria-labelledby={`gallery-tab-${perfume.id}-${item.key}`} tabIndex={0} data-active={phase === index}>
            <span className="gallery-note-caption">{item.caption}</span>
            <p>{perfume.notes[item.key].join(" · ")}</p>
          </div>
        ))}
      </div>
    </details>
  );
}

export function PerfumeGallery() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const trigger = useRef<{ start: number; end: number } | null>(null);
  const activeRef = useRef(0);
  const viewed = useRef(new Set<string>());
  const visible = useRef(false);
  const [active, setActive] = useState(0);
  const [cinematic, setCinematic] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const reduced = useReducedMotion();

  const revealPerfume = useCallback((index: number) => {
    const next = Math.max(0, Math.min(perfumes.length - 1, index));
    if (activeRef.current !== next) {
      if (trigger.current && panels.current[activeRef.current]?.contains(document.activeElement)) {
        viewport.current?.focus({ preventScroll: true });
      }
      activeRef.current = next;
      setActive(next);
    }
    if (visible.current && !viewed.current.has(perfumes[next].id)) {
      viewed.current.add(perfumes[next].id);
      trackEvent("perfume_view", { perfume_id: perfumes[next].id, source: "collection" });
    }
  }, []);

  useEffect(() => {
    setHydrated(true);
    const element = stage.current;
    if (!element) return;
    let collectionViewed = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (entry.isIntersecting) {
        if (!collectionViewed) {
          collectionViewed = true;
          trackEvent("collection_view", { source: "collection" });
        }
        revealPerfume(activeRef.current);
      }
    }, { threshold: 0, rootMargin: "0px 0px -18% 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [revealPerfume]);

  useEffect(() => {
    const element = stage.current;
    const scroller = viewport.current;
    const strip = track.current;
    if (!element || !scroller || !strip) return;
    let disposed = false;
    let revert: (() => void) | undefined;
    // Native scrolling is the baseline. Only a spacious, fine-pointer desktop
    // receives the pinned scene; every product remains in the server HTML.
    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (disposed) return;
      const media = gsap.matchMedia();
      revert = () => media.revert();
      media.add("(min-width: 1024px) and (min-height: 740px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        element.dataset.mode = "cinematic";
        scroller.scrollLeft = 0;
        setCinematic(true);
        const distance = () => Math.max(0, strip.scrollWidth - scroller.clientWidth);
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "cairos-collection",
            trigger: element,
            start: "top top+=68",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => revealPerfume(Math.round(self.progress * (perfumes.length - 1))),
            onRefresh: (self) => { trigger.current = self; },
          },
        });
        timeline.to(strip, { x: () => -distance(), duration: perfumes.length - 1 }, 0);
        panels.current.forEach((panel, index) => {
          if (!panel) return;
          const bottle = panel.querySelector(".gallery-bottle");
          const word = panel.querySelector(".gallery-word");
          if (index > 0) {
            timeline.fromTo(bottle, { scale: 0.89, y: 18 }, { scale: 1, y: 0, duration: 0.7, ease: "power1.out" }, index - 0.7);
            timeline.fromTo(word, { x: 32 }, { x: 0, duration: 0.7 }, index - 0.7);
          }
          if (index < perfumes.length - 1) {
            timeline.to(bottle, { scale: 0.91, y: -12, duration: 0.7 }, index + 0.2);
          }
        });
        trigger.current = timeline.scrollTrigger ?? null;
        ScrollTrigger.refresh();
        return () => {
          trigger.current = null;
          delete element.dataset.mode;
          if (!disposed) setCinematic(false);
          scroller.scrollLeft = 0;
          if (!disposed) revealPerfume(0);
        };
      }, section);
    }).catch(() => {
      // A failed optional animation module must never block the collection.
      revert?.();
      trigger.current = null;
      delete element.dataset.mode;
      if (!disposed) setCinematic(false);
    });
    return () => { disposed = true; revert?.(); };
  }, [revealPerfume]);

  useEffect(() => {
    const element = viewport.current;
    if (!element || cinematic) return;
    if (reduced) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            const index = panels.current.indexOf(entry.target as HTMLElement);
            if (index >= 0) revealPerfume(index);
          }
        });
      }, { threshold: 0.4 });
      panels.current.forEach((panel) => { if (panel) observer.observe(panel); });
      return () => observer.disconnect();
    }
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = element.scrollLeft + element.clientWidth / 2;
        let nearest = 0;
        let nearestDistance = Infinity;
        panels.current.forEach((panel, index) => {
          if (!panel) return;
          const delta = Math.abs(panel.offsetLeft + panel.offsetWidth / 2 - center);
          if (delta < nearestDistance) { nearest = index; nearestDistance = delta; }
        });
        revealPerfume(nearest);
      });
    };
    element.addEventListener("scroll", update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(element);
    update();
    return () => { element.removeEventListener("scroll", update); resize.disconnect(); cancelAnimationFrame(frame); };
  }, [cinematic, reduced, revealPerfume]);

  function select(index: number) {
    const next = Math.max(0, Math.min(perfumes.length - 1, index));
    const scrollTrigger = trigger.current;
    if (scrollTrigger) {
      scrollSceneTo(scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * next / (perfumes.length - 1));
    } else if (reduced) {
      panels.current[next]?.scrollIntoView({ block: "start", behavior: "auto" });
      revealPerfume(next);
    } else {
      const panel = panels.current[next];
      const element = viewport.current;
      if (panel && element) element.scrollTo({ left: panel.offsetLeft - (element.clientWidth - panel.offsetWidth) / 2, behavior: "smooth" });
    }
  }

  function handleGalleryKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      select(activeRef.current + (event.key === "ArrowRight" ? 1 : -1));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      select(event.key === "Home" ? 0 : perfumes.length - 1);
    }
  }

  function skipCollection() {
    const end = document.getElementById("gallery-end");
    if (end) { end.scrollIntoView({ behavior: "auto", block: "start" }); end.focus({ preventScroll: true }); }
  }

  return (
    <section ref={section} id="perfumes" className={`gallery${hydrated ? " gallery-hydrated" : ""}`} style={{ "--gallery-count": perfumes.length } as CSSProperties} aria-labelledby="gallery-heading">
      <div className="gallery-heading">
        <div className="gallery-kicker"><span>02 / A SELEÇÃO</span><span>QUATRO FORMAS DE SENTIR</span></div>
        <h2 id="gallery-heading">Qual presença <em>é a sua?</em></h2>
        <p>Quatro fragrâncias. Quatro universos. Encontre aquele que conversa com você.</p>
      </div>

      <div ref={stage} className="gallery-stage">
        <div className="gallery-edition"><span>CAIRO’S — CURADORIA OLFATIVA</span><a href="#gallery-end" onClick={(event) => { event.preventDefault(); skipCollection(); }}>Pular a seleção <ArrowDown size={14} aria-hidden="true" /></a></div>
        <div ref={viewport} className="gallery-viewport" data-native-scroll={cinematic ? undefined : ""} role="region" aria-roledescription="carrossel" aria-label="Seleção de perfumes. Use as setas do teclado para explorar." tabIndex={0} onKeyDown={handleGalleryKey}>
          <div ref={track} className="gallery-track">
            {perfumes.map((perfume, index) => (
              <article ref={(element) => { panels.current[index] = element; }} key={perfume.id} className={`gallery-panel gallery-panel--${perfume.id}`} data-active={active === index} inert={cinematic && active !== index} aria-labelledby={`gallery-title-${perfume.id}`}>
                <div className="gallery-art">
                  <div className="gallery-light" aria-hidden="true" />
                  <span className="gallery-word" aria-hidden="true">{atmospheres[index].word}</span>
                  <span className="gallery-object" aria-hidden="true">OBJETO / 0{index + 1}</span>
                  <div className={`gallery-bottle gallery-bottle--${perfume.id}`}>
                    <Image src={perfume.image} alt={`Frasco de ${perfume.name}, ${perfume.brand}`} width={1000} height={1000} sizes="(min-width: 1024px) 850px, (min-width: 641px) 680px, 620px" draggable={false} />
                  </div>
                  <span className="gallery-art-caption">{atmospheres[index].signature}</span>
                  <span className="gallery-setting">{atmospheres[index].setting}</span>
                </div>

                <div className="gallery-details" data-native-scroll>
                  <div className="gallery-product-topline"><span>{perfume.brand}</span><span>{perfume.volume} ML · EDP</span></div>
                  <div className="gallery-product-summary"><h3 id={`gallery-title-${perfume.id}`}>{perfume.name}</h3><p className="gallery-family">{perfume.family}</p><p className="gallery-mood">{atmospheres[index].mood}</p></div>
                  <FragranceNotes perfume={perfume} reduced={reduced} />
                  <div onClickCapture={() => trackEvent("perfume_cta_click", { perfume_id: perfume.id, source: "collection" })} className="gallery-contact-wrap">
                    <ContactButton className="gallery-contact" message={productMessage(perfume.name)}>Quero conhecer {perfume.id === "qahwa" ? "Qahwa" : perfume.name}<ArrowUpRight size={19} aria-hidden="true" /></ContactButton>
                  </div>
                  <span className="gallery-service-note">Consulte disponibilidade e valores pelo WhatsApp.</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="gallery-navigation">
          <div className="gallery-navigation-top"><p><span className="gallery-desktop-hint">Continue rolando para explorar</span><span className="gallery-touch-hint">Deslize e encontre sua presença</span><ArrowRight size={15} aria-hidden="true" /></p><span className="gallery-counter" aria-hidden="true">0{active + 1}<span> / 04</span></span><div className="gallery-arrows"><motion.button type="button" aria-label="Perfume anterior" onClick={() => select(active - 1)} disabled={active === 0} whileTap={reduced ? undefined : { scale: 0.94 }}><ArrowLeft size={18} /></motion.button><motion.button type="button" aria-label="Próximo perfume" onClick={() => select(active + 1)} disabled={active === perfumes.length - 1} whileTap={reduced ? undefined : { scale: 0.94 }}><ArrowRight size={18} /></motion.button></div></div>
          <div className="gallery-index" role="group" aria-label="Escolha uma fragrância">
            {perfumes.map((item, index) => (
              <motion.button key={item.id} type="button" className={index === active ? "is-active" : ""} aria-pressed={index === active} aria-label={`Explorar ${item.name}`} onClick={() => select(index)} whileTap={reduced ? undefined : { scale: 0.97 }}>
                <span className="gallery-index-number">0{index + 1}</span><span className="gallery-index-name">{item.id === "qahwa" ? "Qahwa" : item.name}</span><span className="gallery-index-line" aria-hidden="true" />
              </motion.button>
            ))}
          </div>
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">Perfume {active + 1} de {perfumes.length}: {perfumes[active].name}, {perfumes[active].brand}. {perfumes[active].family}.</p>
      </div>
      <div id="gallery-end" className="gallery-end" tabIndex={-1}><span>Quatro encontros possíveis.</span><span>A próxima história começa na pele. <ArrowDown size={16} aria-hidden="true" /></span></div>
    </section>
  );
}
