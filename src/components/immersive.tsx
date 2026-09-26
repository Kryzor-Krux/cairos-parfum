"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { ArrowDown, ArrowUpRight, Flame, Flower2, Coffee } from "lucide-react";
import { ContactButton } from "./experience";
import { productMessage } from "@/lib/contact";

const scenes = [
  {
    word: "Desperta.",
    label: "A PRIMEIRA IMPRESSÃO",
    title: "O primeiro encontro.",
    text: "Gengibre, canela e cardamomo. O calor das especiarias abre a história.",
    notes: ["Gengibre", "Canela", "Cardamomo"],
    icon: Flame,
  },
  {
    word: "Envolve.",
    label: "O QUE SE REVELA",
    title: "Devagar, se revela.",
    text: "Pralinê, frutas cristalizadas e flores brancas. Uma doçura que ganha novas camadas.",
    notes: ["Pralinê", "Frutas cristalizadas", "Flores brancas"],
    icon: Flower2,
  },
  {
    word: "Permanece.",
    label: "A MEMÓRIA QUE FICA",
    title: "Algumas presenças ficam.",
    text: "Café arábica, baunilha e fava tonka encontram musk e benjoim. Profundidade que envolve.",
    notes: ["Café arábica", "Baunilha", "Fava tonka"],
    icon: Coffee,
  },
];

export function NotesStory() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const rotate = useTransform(scrollYProgress, [0, 0.45, 1], [-14, 8, -5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.04, 0.96]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [12, -16, 4]);
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.min(2, Math.floor(v * 3))),
  );
  const jump = (index: number) => {
    if (!ref.current) return;
    const distance = ref.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top:
        ref.current.getBoundingClientRect().top +
        window.scrollY +
        distance * ((index + 0.15) / 3),
      behavior: reduced ? "instant" : "smooth",
    });
  };
  return (
    <section
      id="experiencia"
      ref={ref}
      className={`cinema ${reduced ? "cinema-reduced" : ""}`}
      aria-label="Uma fragrância, três momentos"
    >
      <div className={`cinema-stage scene-${active}`}>
        <div className="cinema-grain" aria-hidden="true" />
        <div className="cinema-top">
          <span>02 — DENTRO DA FRAGRÂNCIA</span>
          <span>KHAMRAH QAHWA</span>
        </div>
        <div className="scene-navigation" aria-label="Capítulos da fragrância">
          {scenes.map((scene, i) => (
            <button
              key={scene.word}
              aria-label={`Capítulo ${i + 1}: ${scene.label}`}
              aria-current={active === i ? "step" : undefined}
              onClick={() => jump(i)}
            >
              <span className={i <= active ? "filled" : ""} />
            </button>
          ))}
        </div>
        <div className="cinema-art" aria-hidden="true">
          <div className="cinema-halo" />
          <div className="cinema-orbit orbit-one" />
          <div className="cinema-orbit orbit-two" />
          {scenes.map((scene, i) => (
            <span
              key={scene.word}
              className={`cinema-word ${active === i ? "current" : ""}`}
            >
              {scene.word}
            </span>
          ))}
          <motion.div
            className="cinema-flacon"
            style={reduced ? {} : { rotate, scale, y }}
          >
            <Image
              src="/images/qahwa.webp"
              width={1000}
              height={1000}
              sizes="(max-width:640px) 640px, 900px"
              alt=""
            />
          </motion.div>
          <span className="cinema-side">LATTAFA · EAU DE PARFUM · 100 ML</span>
        </div>
        <div className="cinema-copy">
          {scenes.map((scene, i) => {
            const Icon = scene.icon;
            return (
              <article
                key={scene.word}
                className={`scene-copy ${active === i ? "current" : ""}`}
                aria-hidden={reduced ? false : active !== i}
              >
                <div className="scene-label">
                  <span>0{i + 1}</span>
                  <span>{scene.label}</span>
                  <Icon size={20} strokeWidth={1.3} />
                </div>
                <h2>{scene.title}</h2>
                <p>{scene.text}</p>
                <div className="scene-notes">
                  {scene.notes.map((note) => (
                    <span key={note}>{note}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
        <div className="cinema-bottom">
          <span>
            <ArrowDown size={15} /> CONTINUE PARA SENTIR
          </span>
          <a href="#relatos">
            Pular experiência <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <div className="cinema-after">
        <span className="eyebrow">A HISTÓRIA CONTINUA NA SUA PELE.</span>
        <ContactButton
          className="button dark"
          message={productMessage("Khamrah Qahwa")}
        >
          Quero conhecer o Qahwa <ArrowUpRight size={18} />
        </ContactButton>
        <p>Cada pele revela a fragrância de um jeito.</p>
      </div>
    </section>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 55%"],
  });
  const clip = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  return (
    <div ref={ref} className="manifesto immersive-manifesto">
      <span className="little-star" aria-hidden="true">
        ✧
      </span>
      <p>
        Não é só perfume.
        <br />
        <span className="manifesto-reveal">
          É como você fica.
          <motion.em
            aria-hidden="true"
            style={reduced ? {} : { clipPath: clip }}
          >
            É como você fica.
          </motion.em>
        </span>
      </p>
      <span className="eyebrow">NA PELE. NA MEMÓRIA. EM VOCÊ.</span>
    </div>
  );
}
