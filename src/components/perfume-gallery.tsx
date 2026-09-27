"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Minus, Plus } from "lucide-react";
import { perfumes } from "@/data/perfumes";
import { productMessage } from "@/lib/contact";
import { ContactButton } from "@/components/experience";

const atmospheres = [
  { word: "Intenso", signature: "Café. Especiarias. Pele.", mood: "Uma pausa quente. Uma presença longa na memória." },
  { word: "Livre", signature: "Cítricos. Cedro. Horizonte.", mood: "A sensação de abrir as janelas para um novo dia." },
  { word: "Magnético", signature: "Flores. Cacau. Mistério.", mood: "Entre a delicadeza das flores e a vontade de ficar." },
  { word: "Singular", signature: "Abacaxi. Oud. Contraste.", mood: "O inesperado tem uma maneira própria de chegar." },
];

const phases = [
  { key: "top", label: "Abertura", caption: "O primeiro encontro", description: "As notas que apresentam a fragrância." },
  { key: "heart", label: "Coração", caption: "O que se revela", description: "O centro da composição, quando o perfume se desenvolve." },
  { key: "base", label: "Fundo", caption: "O que permanece", description: "As notas que dão profundidade à fragrância." },
] as const;

export function PerfumeGallery() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [notesOpen, setNotesOpen] = useState(false);
  const [phase, setPhase] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const reduced = useReducedMotion();
  const gesture = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const perfume = perfumes[active];
  const atmosphere = atmospheres[active];

  function select(index: number, movement?: number) {
    const next = (index + perfumes.length) % perfumes.length;
    if (next === active) return;
    setDirection(movement ?? (next > active ? 1 : -1));
    setActive(next);
    setPhase(0);
    setDragOffset(0);
  }

  function beginGesture(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    gesture.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveGesture(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.abs(x) > Math.abs(y) * 1.3) setDragOffset(Math.max(-45, Math.min(45, x * 0.22)));
  }

  function endGesture(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    gesture.current = null;
    setDragOffset(0);
    if (!start || start.pointerId !== event.pointerId) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.3) select(active + (x < 0 ? 1 : -1), x < 0 ? 1 : -1);
  }

  function handleGalleryKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const movement = event.key === "ArrowRight" ? 1 : -1;
      select(active + movement, movement);
    }
  }

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
    <section id="perfumes" className={`gallery gallery--${perfume.id}`} aria-labelledby="gallery-heading">
      <div className="gallery-heading">
        <div className="gallery-kicker"><span>02 / A SELEÇÃO</span><span>QUATRO FORMAS DE SENTIR</span></div>
        <h2 id="gallery-heading">Qual presença <em>é a sua?</em></h2>
        <p>Não escolha só pelo nome. Entre no universo de cada fragrância.</p>
      </div>

      <div className="gallery-showroom" role="region" aria-roledescription="carrossel" aria-label="Explore nossa seleção de perfumes">
        <div className="gallery-edition" aria-hidden="true"><span>CAIRO’S — CURADORIA OLFATIVA</span><span>OBJETO {String(active + 1).padStart(2, "0")} / 04</span></div>

        <div className="gallery-composition">
          <div
            className="gallery-art"
            tabIndex={0}
            role="group"
            aria-label={`${perfume.name}. Use as setas do teclado ou arraste para explorar os perfumes.`}
            onKeyDown={handleGalleryKey}
            onPointerDown={beginGesture}
            onPointerMove={moveGesture}
            onPointerUp={endGesture}
            onPointerCancel={() => { gesture.current = null; setDragOffset(0); }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                className="gallery-word"
                key={atmosphere.word}
                aria-hidden="true"
                initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -18 }}
                transition={{ duration: reduced ? 0 : 0.28 }}
              >{atmosphere.word}</motion.span>
            </AnimatePresence>
            <span className="gallery-shadow" aria-hidden="true" />
            {perfumes.map((item, index) => (
              <motion.div
                className={`gallery-bottle gallery-bottle--${item.id}`}
                key={item.id}
                aria-hidden={index !== active}
                initial={false}
                animate={{
                  opacity: index === active ? 1 : 0,
                  x: index === active ? (reduced ? 0 : dragOffset) : (reduced ? 0 : direction * -65),
                  y: index === active ? 0 : (reduced ? 0 : 12),
                  rotate: index === active ? 0 : (reduced ? 0 : direction * -4),
                  scale: index === active ? 1 : (reduced ? 1 : 0.96),
                }}
                transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src={item.image} alt={index === active ? `Frasco de ${item.name}, ${item.brand}` : ""} width={1000} height={1000} sizes="(max-width: 640px) 750px, 1000px" draggable={false} />
              </motion.div>
            ))}
            <span className="gallery-art-caption" aria-hidden="true">{atmosphere.signature}</span>
            <div className="gallery-art-controls" onPointerDown={(event) => event.stopPropagation()}>
              <button type="button" aria-label="Perfume anterior" onClick={() => select(active - 1, -1)}><ArrowLeft size={19} /></button>
              <button type="button" aria-label="Próximo perfume" onClick={() => select(active + 1, 1)}><ArrowRight size={19} /></button>
            </div>
            <span className="gallery-swipe-hint"><span>←</span> ARRASTE PARA SENTIR <span>→</span></span>
          </div>

          <div className="gallery-details">
            <div className="gallery-product-topline"><span>{perfume.brand}</span><span>{perfume.volume} ML · EDP</span></div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={perfume.id} initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -8 }} transition={{ duration: reduced ? 0 : 0.2 }}>
                <h3>{perfume.name}</h3>
                <p className="gallery-family">{perfume.family}</p>
                <p className="gallery-mood">{atmosphere.mood}</p>
              </motion.div>
            </AnimatePresence>
            <div className="gallery-notes">
              <button className="gallery-notes-toggle" aria-expanded={notesOpen} aria-controls="gallery-notes-content" onClick={() => setNotesOpen(!notesOpen)}>
                <span>Dentro da fragrância</span>{notesOpen ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              <div id="gallery-notes-content" hidden={!notesOpen} className="gallery-notes-content">
                <div className="gallery-note-tabs" role="tablist" aria-label={`Notas de ${perfume.name}`}>
                  {phases.map((item, index) => (
                    <button key={item.key} ref={(element) => { tabs.current[index] = element; }} id={`gallery-tab-${item.key}`} type="button" role="tab" aria-selected={phase === index} aria-controls={`gallery-panel-${item.key}`} tabIndex={phase === index ? 0 : -1} onClick={() => setPhase(index)} onKeyDown={(event) => handleTabKey(event, index)}>
                      <span>0{index + 1}</span>{item.label}
                    </button>
                  ))}
                </div>
                {phases.map((item, index) => (
                  <div key={item.key} id={`gallery-panel-${item.key}`} className="gallery-note-panel" role="tabpanel" aria-labelledby={`gallery-tab-${item.key}`} tabIndex={0} hidden={phase !== index}>
                    <span className="gallery-note-caption">{item.caption}</span>
                    <p>{perfume.notes[item.key].join(" · ")}</p>
                    <small>{item.description}</small>
                  </div>
                ))}
              </div>
            </div>
            <ContactButton className="gallery-contact" message={productMessage(perfume.name)}>Quero conhecer {perfume.name === "Khamrah Qahwa" ? "Qahwa" : perfume.name}<ArrowUpRight size={19} /></ContactButton>
            <span className="gallery-service-note">Disponibilidade e valores em uma conversa com a gente.</span>
          </div>
        </div>

        <div className="gallery-navigation">
          <div className="gallery-index" role="group" aria-label="Escolha uma fragrância">
            {perfumes.map((item, index) => (
              <button key={item.id} type="button" className={index === active ? "is-active" : ""} aria-pressed={index === active} aria-label={`Explorar ${item.name}`} onClick={() => select(index)}>
                <span className="gallery-index-number">0{index + 1}</span><span className="gallery-index-name">{item.name === "Khamrah Qahwa" ? "Qahwa" : item.name}</span><span className="gallery-index-line" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">Perfume {active + 1} de {perfumes.length}: {perfume.name}, {perfume.brand}. {perfume.family}.</p>
      </div>
    </section>
  );
}
