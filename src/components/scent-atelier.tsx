"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, RotateCcw } from "lucide-react";
import { ContactButton } from "./experience";
import { perfumes } from "@/data/perfumes";
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

type Choice = { id: string; name: string; detail: string; material: string; word: string };
const feelings: Choice[] = [
  { id: "fresco", name: "Frescor & liberdade", detail: "A luz atravessa. O ar se abre.", material: "air", word: "Ar" },
  { id: "envolvente", name: "Calor & aconchego", detail: "Um abraço que tem textura.", material: "amber", word: "Âmbar" },
  { id: "floral", name: "Flores & delicadeza", detail: "Suave, nunca sem presença.", material: "petal", word: "Flor" },
  { id: "marcante", name: "Mistério & presença", detail: "A beleza do inesperado.", material: "wood", word: "Sombra" },
];
const occasions: Choice[] = [
  { id: "cotidiano", name: "No meu cotidiano", detail: "Pequenos rituais. Todos os dias.", material: "day", word: "Dia" },
  { id: "encontro", name: "Em um encontro", detail: "O tempo desacelera a dois.", material: "encounter", word: "Perto" },
  { id: "noite", name: "Quando a noite começa", detail: "A cidade muda. Você também.", material: "night", word: "Noite" },
];
const presences: Choice[] = [
  { id: "leve", name: "Leveza", detail: "Quero uma sensação luminosa.", material: "veil", word: "Livre" },
  { id: "proxima", name: "Proximidade", detail: "Algo que convida a chegar perto.", material: "silk", word: "Íntimo" },
  { id: "memoravel", name: "Personalidade", detail: "Uma assinatura com a minha cara.", material: "stone", word: "Único" },
];
const steps = [
  { name: "Sensação", heading: <>Feche os olhos.<br /><em>O que te atrai?</em></>, hint: "Siga a primeira sensação.", choices: feelings },
  { name: "Momento", heading: <>Agora, imagine<br /><em>o momento.</em></>, hint: "Onde essa fragrância encontra você?", choices: occasions },
  { name: "Presença", heading: <>Como você quer<br /><em>se sentir?</em></>, hint: "Escolha o detalhe que faz sentido para você.", choices: presences },
];

function Material({ name, word }: { name: string; word: string }) {
  return (
    <span className={`atelier-material atelier-material-${name}`} aria-hidden="true">
      <span className="atelier-material-core" />
      <span className="atelier-material-layer" />
      <span className="atelier-material-word">{word}</span>
    </span>
  );
}

export function ScentAtelier() {
  const [step, setStep] = useState(0);
  const [feeling, setFeeling] = useState<ScentFeeling | null>(null);
  const [occasion, setOccasion] = useState<ScentOccasion | null>(null);
  const [presence, setPresence] = useState<ScentPresence | null>(null);
  const [result, setResult] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const focusAfterChange = useRef(false);
  const hasAdvanced = useRef(false);
  const reduced = useReducedMotion();
  const currentSelection = [feeling, occasion, presence][step];
  const stage = result ? "result" : String(step);
  const profile: ScentProfile | null = feeling && occasion && presence ? { feeling, occasion, presence } : null;
  const recommended = profile ? perfumes.find((perfume) => perfume.id === recommendScent(profile))! : null;

  const registerHeading = useCallback((node: HTMLHeadingElement | null) => {
    if (node && focusAfterChange.current) {
      node.focus({ preventScroll: true });
      focusAfterChange.current = false;
    }
  }, []);

  useEffect(() => {
    if (!hasAdvanced.current) return;
    if (stageRef.current && stageRef.current.getBoundingClientRect().top < 75) {
      stageRef.current.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
    }
  }, [step, result, reduced]);

  const choose = (value: string) => {
    if (step === 0) setFeeling(value as ScentFeeling);
    if (step === 1) setOccasion(value as ScentOccasion);
    if (step === 2) setPresence(value as ScentPresence);
  };
  const advance = () => {
    if (!currentSelection) return;
    focusAfterChange.current = true;
    hasAdvanced.current = true;
    setHovered(null);
    if (step < 2) setStep(step + 1);
    else setResult(true);
  };
  const back = () => {
    focusAfterChange.current = true;
    setHovered(null);
    if (result) setResult(false);
    else setStep(Math.max(0, step - 1));
  };
  const restart = () => {
    focusAfterChange.current = true;
    setStep(0);
    setResult(false);
    setFeeling(null);
    setOccasion(null);
    setPresence(null);
    setHovered(null);
  };

  return (
    <section id="descoberta" className="atelier" aria-labelledby="atelier-title">
      <div className="atelier-masthead">
        <div className="atelier-label"><span className="atelier-star" aria-hidden="true">✳</span> O ATELIER CAIRO’S</div>
        <span className="atelier-masthead-caption">TRÊS ESCOLHAS. UMA NOVA DESCOBERTA.</span>
      </div>
      <div className="atelier-intro">
        <h2 id="atelier-title">Um perfume.<br /><em>O seu universo.</em></h2>
        <p>Antes das notas, vem você.<br />Entre no nosso atelier e encontre<br className="atelier-desktop-break" /> um novo ponto de partida.</p>
      </div>
      <div className="atelier-stage" ref={stageRef}>
        <div className="atelier-progress" aria-label="Etapas da descoberta">
          {steps.map((item, index) => (
            <div key={item.name} className={`atelier-progress-step ${index === step && !result ? "atelier-progress-current" : ""} ${index < step || result ? "atelier-progress-complete" : ""}`} aria-current={index === step && !result ? "step" : undefined}>
              <span>{index < step || result ? <Check size={12} aria-label="Concluída" /> : `0${index + 1}`}</span>
              <span>{item.name}</span>
              <i aria-hidden="true" />
            </div>
          ))}
          <span className="atelier-progress-end">{result ? "A SUA DESCOBERTA" : "SEU INSTINTO SABE."}</span>
        </div>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={stage}
            className={`atelier-panel ${result ? "atelier-panel-result" : ""}`}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: "easeOut" }}
          >
            {result && recommended && profile ? (
              <div className={`atelier-result atelier-result-${recommended.tone}`}>
                <div className="atelier-result-art">
                  <span className="atelier-result-orbit" aria-hidden="true" />
                  <span className="atelier-result-mark" aria-hidden="true">C.</span>
                  <Image src={recommended.image} alt={`Frasco de ${recommended.name}`} width={800} height={800} sizes="(max-width: 700px) 88vw, 45vw" className="atelier-result-bottle" />
                  <span className="atelier-result-caption">{recommended.brand} / {recommended.volume} ML</span>
                </div>
                <div className="atelier-result-copy">
                  <span className="atelier-label">A SUA PRIMEIRA DESCOBERTA</span>
                  <h3 tabIndex={-1} ref={registerHeading}>{recommended.name}</h3>
                  <p className="atelier-result-family">{recommended.family}</p>
                  <p className="atelier-result-rationale">{atelierRationale[recommended.id as keyof typeof atelierRationale]}</p>
                  <div className="atelier-result-notes" aria-label="Notas de destaque">
                    {[recommended.notes.top[0], recommended.notes.heart[0], recommended.notes.base[0]].map((note, index) => (
                      <div key={note}><span>0{index + 1}</span><strong>{note}</strong></div>
                    ))}
                  </div>
                  <p className="atelier-result-profile">Você escolheu <strong>{atelierLabels.feeling[profile.feeling].toLowerCase()}</strong>, <strong>{atelierLabels.occasion[profile.occasion].toLowerCase()}</strong> e <strong>{atelierLabels.presence[profile.presence].toLowerCase()}</strong>.</p>
                  <ContactButton className="atelier-contact" message={atelierMessage(profile, recommended.name)}>Conversar sobre minha descoberta <ArrowUpRight size={19} /></ContactButton>
                  <p className="atelier-result-footnote">Uma sugestão da nossa seleção, a partir das suas escolhas e das notas de cada perfume. O encontro final acontece na pele.</p>
                  <div className="atelier-result-actions">
                    <button type="button" onClick={back}><ArrowLeft size={15} /> Ajustar escolhas</button>
                    <button type="button" onClick={restart}><RotateCcw size={14} /> Recomeçar</button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="atelier-question">
                  <h3 ref={registerHeading} tabIndex={-1}>{steps[step].heading}</h3>
                  <p>{steps[step].hint}</p>
                  <span className="atelier-question-number" aria-hidden="true">0{step + 1}</span>
                </div>
                <div className={`atelier-choices atelier-choices-${steps[step].choices.length}`} role="group" aria-label={`${steps[step].name}: escolha uma opção`}>
                  {steps[step].choices.map((choice, index) => (
                    <button
                      type="button"
                      key={choice.id}
                      className={`atelier-choice ${currentSelection === choice.id ? "atelier-choice-selected" : ""} ${hovered === choice.id ? "atelier-choice-hovered" : ""}`}
                      aria-pressed={currentSelection === choice.id}
                      onClick={() => choose(choice.id)}
                      onPointerEnter={() => setHovered(choice.id)}
                      onPointerLeave={() => setHovered(null)}
                    >
                      <Material name={choice.material} word={choice.word} />
                      <span className="atelier-choice-header"><span>0{index + 1}</span><span className="atelier-choice-check">{currentSelection === choice.id ? <Check size={15} /> : <ArrowUpRight size={17} />}</span></span>
                      <span className="atelier-choice-caption"><strong>{choice.name}</strong><span>{choice.detail}</span></span>
                    </button>
                  ))}
                </div>
                <div className="atelier-controls">
                  {step > 0 ? <button type="button" className="atelier-back" onClick={back}><ArrowLeft size={16} /> Voltar</button> : <span className="atelier-controls-caption">NÃO EXISTE ESCOLHA ERRADA.</span>}
                  <button type="button" className="atelier-next" disabled={!currentSelection} onClick={advance}>{step === 2 ? "Revelar minha descoberta" : "Continuar"}<ArrowRight size={18} /></button>
                </div>
                <span className="atelier-sr" aria-live="polite">{currentSelection ? `Selecionado: ${steps[step].choices.find((choice) => choice.id === currentSelection)?.name}. Continue para ${step === 2 ? "revelar sua descoberta" : "a próxima etapa"}.` : "Escolha uma opção para continuar."}</span>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="atelier-footer"><span>O PERFUME É PESSOAL.</span><span>A ESCOLHA TAMBÉM.</span></div>
    </section>
  );
}
