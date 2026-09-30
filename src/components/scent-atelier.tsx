"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, RotateCcw } from "lucide-react";
import { ContactButton } from "./experience";
import { perfumes } from "@/data/perfumes";
import { trackEvent } from "@/lib/analytics";
import { scrollSceneTo } from "@/lib/motion/scroll";
import {
  atelierLabels,
  atelierMessage,
  atelierRationale,
  recommendScent,
  type ScentFeeling,
  type ScentOccasion,
  type ScentPresence,
  type ScentProfile,
} from "@/lib/atelier";
import "@/app/atelier.css";

const editorialEase = [0.22, 1, 0.36, 1] as const;
type Choice = { id: string; name: string; detail: string; material: string; word: string };
type AtelierStep = { id: string; name: string; heading: ReactNode; hint: string; choices: Choice[] };
const steps: AtelierStep[] = [
  {
    id: "feeling", name: "Sensação", heading: <>Feche os olhos.<br /><em>O que te atrai?</em></>, hint: "Siga a primeira sensação.",
    choices: [
      { id: "fresco", name: "Frescor & liberdade", detail: "A luz atravessa. O ar se abre.", material: "air", word: "Ar" },
      { id: "envolvente", name: "Calor & aconchego", detail: "Um abraço que tem textura.", material: "amber", word: "Âmbar" },
      { id: "floral", name: "Flores & delicadeza", detail: "Suave, nunca sem presença.", material: "petal", word: "Flor" },
      { id: "marcante", name: "Mistério & presença", detail: "A beleza do inesperado.", material: "wood", word: "Sombra" },
    ],
  },
  {
    id: "occasion", name: "Momento", heading: <>Agora, imagine<br /><em>o momento.</em></>, hint: "Onde essa fragrância encontra você?",
    choices: [
      { id: "cotidiano", name: "No meu cotidiano", detail: "Pequenos rituais. Todos os dias.", material: "day", word: "Dia" },
      { id: "encontro", name: "Em um encontro", detail: "O tempo desacelera a dois.", material: "encounter", word: "Perto" },
      { id: "noite", name: "Quando a noite começa", detail: "A cidade muda. Você também.", material: "night", word: "Noite" },
    ],
  },
  {
    id: "presence", name: "Presença", heading: <>Como você quer<br /><em>se sentir?</em></>, hint: "O detalhe que transforma um perfume em seu.",
    choices: [
      { id: "leve", name: "Leveza", detail: "Quero uma sensação luminosa.", material: "veil", word: "Livre" },
      { id: "proxima", name: "Proximidade", detail: "Algo que convida a chegar perto.", material: "silk", word: "Íntimo" },
      { id: "memoravel", name: "Personalidade", detail: "Uma assinatura com a minha cara.", material: "stone", word: "Único" },
    ],
  },
];

function Material({ name, word, ambient = false }: { name: string; word?: string; ambient?: boolean }) {
  return <span className={`atelier-material atelier-material-${name}${ambient ? " atelier-material-ambient" : ""}`} aria-hidden="true">
    <span className="atelier-material-core" />
    <span className="atelier-material-layer" />
    {word ? <span className="atelier-material-word">{word}</span> : null}
  </span>;
}

export function ScentAtelier() {
  const [step, setStep] = useState(0);
  const [feeling, setFeeling] = useState<ScentFeeling | null>(null);
  const [occasion, setOccasion] = useState<ScentOccasion | null>(null);
  const [presence, setPresence] = useState<ScentPresence | null>(null);
  const [result, setResult] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const focusAfterChange = useRef(false);
  const hasAdvanced = useRef(false);
  const started = useRef(false);
  const reduced = useReducedMotion();
  const currentSelection = [feeling, occasion, presence][step];
  const selectedChoice = steps[step].choices.find((choice) => choice.id === currentSelection);
  const material = selectedChoice?.material ?? ["wood", "encounter", "veil"][step];
  const stage = result ? "result" : String(step);
  const profile: ScentProfile | null = feeling && occasion && presence ? { feeling, occasion, presence } : null;
  const recommended = profile ? perfumes.find((perfume) => perfume.id === recommendScent(profile)) : null;

  const registerHeading = useCallback((node: HTMLHeadingElement | null) => {
    if (node && focusAfterChange.current) {
      node.focus({ preventScroll: true });
      focusAfterChange.current = false;
    }
  }, []);

  useEffect(() => {
    if (!hasAdvanced.current || !stageRef.current) return;
    if (stageRef.current.getBoundingClientRect().top < 80) {
      scrollSceneTo(window.scrollY + stageRef.current.getBoundingClientRect().top - 84, { immediate: Boolean(reduced) });
    }
  }, [step, result, reduced]);

  function choose(value: string) {
    if (!started.current) {
      trackEvent("atelier_start", { source: "atelier" });
      started.current = true;
    }
    if (step === 0) setFeeling(value as ScentFeeling);
    if (step === 1) setOccasion(value as ScentOccasion);
    if (step === 2) setPresence(value as ScentPresence);
  }

  function advance() {
    if (!currentSelection) return;
    focusAfterChange.current = true;
    hasAdvanced.current = true;
    trackEvent("atelier_step", { step: steps[step].id, choice: currentSelection });
    if (step < 2) setStep(step + 1);
    else if (recommended) {
      trackEvent("atelier_complete", { perfume_id: recommended.id, source: "atelier" });
      setResult(true);
    }
  }

  function back() {
    focusAfterChange.current = true;
    if (result) setResult(false);
    else setStep(Math.max(0, step - 1));
  }

  function restart() {
    focusAfterChange.current = true;
    started.current = false;
    setStep(0);
    setResult(false);
    setFeeling(null);
    setOccasion(null);
    setPresence(null);
  }

  return <section id="descoberta" className="atelier" aria-labelledby="atelier-title">
    <div className="atelier-masthead">
      <div className="atelier-label"><span className="atelier-star" aria-hidden="true">✳</span> O ATELIER CAIRO’S</div>
      <span className="atelier-masthead-caption">UMA CONSULTORIA QUE COMEÇA EM VOCÊ.</span>
    </div>
    <div className="atelier-intro">
      <h2 id="atelier-title">Antes das notas,<br /><em>vem você.</em></h2>
      <p>Uma sensação, um momento, uma presença.<br />Três escolhas para encontrar um perfume<br className="atelier-desktop-break" /> que converse com o seu universo.</p>
    </div>
    <div className={`atelier-stage${result ? " is-result" : ""}`} ref={stageRef}>
      <div className="atelier-stage-atmosphere" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div key={material} className="atelier-ambient-layer" initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.7, ease: editorialEase }}>
            <Material name={material} ambient />
          </motion.div>
        </AnimatePresence>
      </div>
      <ol className="atelier-progress" aria-label="Etapas da consultoria">
        {steps.map((item, index) => <li key={item.id} className={`atelier-progress-step ${index === step && !result ? "atelier-progress-current" : ""} ${index < step || result ? "atelier-progress-complete" : ""}`} aria-current={index === step && !result ? "step" : undefined}>
          <span>{index < step || result ? <Check size={13} aria-label="Concluída" /> : `0${index + 1}`}</span><span>{item.name}</span><i aria-hidden="true" />
        </li>)}
      </ol>
      <AnimatePresence initial={false} mode="wait">
        <motion.div key={stage} className={`atelier-panel ${result ? "atelier-panel-result" : ""}`} initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }} transition={{ duration: reduced ? 0 : 0.32, ease: editorialEase }}>
          {result && recommended && profile ? <div className={`atelier-result atelier-result-${recommended.tone}`}>
            <div className="atelier-result-art">
              <span className="atelier-result-art-label">CAIRO’S / FICHA OLFATIVA</span>
              <span className="atelier-result-mark" aria-hidden="true">C.</span>
              <div className={`atelier-result-image atelier-result-image-${recommended.id}`}>
                <Image src={recommended.image} alt={`Frasco de ${recommended.name}`} fill sizes="(max-width: 760px) 90vw, 45vw" className="atelier-result-bottle" />
              </div>
              <span className="atelier-result-caption">{recommended.brand}<br />{recommended.concentration} · {recommended.volume} ml</span>
            </div>
            <div className="atelier-result-copy">
              <span className="atelier-label">SEU PERFIL APONTA PARA…</span>
              <h3 tabIndex={-1} ref={registerHeading}>{recommended.name}</h3>
              <p className="atelier-result-family">{recommended.family}</p>
              <p className="atelier-result-rationale">{atelierRationale[recommended.id as keyof typeof atelierRationale]}</p>
              <dl className="atelier-result-notes" aria-label="Notas de destaque da fragrância">
                {[{ label: "Abertura", note: recommended.notes.top[0] }, { label: "Coração", note: recommended.notes.heart[0] }, { label: "Fundo", note: recommended.notes.base[0] }].map(({ label, note }) => <div key={label}><dt>{label}</dt><dd>{note}</dd></div>)}
              </dl>
              <div className="atelier-result-profile"><span>O SEU PONTO DE PARTIDA</span><p>{atelierLabels.feeling[profile.feeling]}<br />{atelierLabels.occasion[profile.occasion]}<br />{atelierLabels.presence[profile.presence]}</p></div>
              <ContactButton className="atelier-contact" message={atelierMessage(profile, recommended.name)}>Quero conhecer este perfume <ArrowUpRight size={20} /></ContactButton>
              <p className="atelier-result-footnote">Uma sugestão da nossa seleção, a partir das suas escolhas e das notas de cada perfume. O encontro final acontece na pele.</p>
              <div className="atelier-result-actions"><button type="button" onClick={back}><ArrowLeft size={16} /> Ajustar escolhas</button><button type="button" onClick={restart}><RotateCcw size={15} /> Recomeçar</button></div>
            </div>
          </div> : <>
            <div className="atelier-question">
              <span className="atelier-question-label">SEU UNIVERSO / 0{step + 1}</span>
              <h3 id={`atelier-question-${step}`} ref={registerHeading} tabIndex={-1}>{steps[step].heading}</h3>
              <p>{steps[step].hint}</p>
              <div className="atelier-selection-echo" aria-hidden="true"><AnimatePresence mode="wait" initial={false}><motion.span key={selectedChoice?.word ?? "instinto"} initial={reduced ? false : { y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} exit={{ y: reduced ? "0%" : "-60%", opacity: 0 }} transition={{ duration: reduced ? 0 : 0.55, ease: editorialEase }}>{selectedChoice?.word ?? "Instinto."}</motion.span></AnimatePresence></div>
            </div>
            <div className="atelier-choice-area">
              <div className={`atelier-choices atelier-choices-${steps[step].choices.length}`} role="group" aria-labelledby={`atelier-question-${step}`}>
                {steps[step].choices.map((choice, index) => <button type="button" key={choice.id} className={`atelier-choice ${currentSelection === choice.id ? "atelier-choice-selected" : ""}`} aria-pressed={currentSelection === choice.id} onClick={() => choose(choice.id)}>
                  <Material name={choice.material} word={choice.word} />
                  <span className="atelier-choice-header"><span>0{index + 1}</span><span className="atelier-choice-check" aria-hidden="true">{currentSelection === choice.id ? <Check size={15} /> : <ArrowUpRight size={17} />}</span></span>
                  <span className="atelier-choice-caption"><strong>{choice.name}</strong><span>{choice.detail}</span></span>
                </button>)}
              </div>
              <div className="atelier-controls">
                {step > 0 ? <button type="button" className="atelier-back" onClick={back}><ArrowLeft size={16} /> Voltar</button> : <span className="atelier-controls-caption">SEU INSTINTO SABE.</span>}
                <button type="button" className="atelier-next" disabled={!currentSelection} onClick={advance}>{step === 2 ? "Revelar meu perfume" : "Continuar"}<ArrowRight size={18} /></button>
              </div>
              <span className="atelier-sr" aria-live="polite">{selectedChoice ? `Selecionado: ${selectedChoice.name}. Continue para ${step === 2 ? "revelar sua descoberta" : "a próxima etapa"}.` : "Escolha uma opção para continuar."}</span>
            </div>
          </>}
        </motion.div>
      </AnimatePresence>
    </div>
    <div className="atelier-footer"><span>O PERFUME É PESSOAL.</span><span>A ESCOLHA TAMBÉM.</span></div>
  </section>;
}
