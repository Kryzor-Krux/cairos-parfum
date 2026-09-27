"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Plus, X } from "lucide-react";
import { ContactButton } from "./experience";
import { productMessage } from "@/lib/contact";
import { testimonials } from "@/data/perfumes";

const chapters = [
  { name: "A coleção", href: "#perfumes", sub: "Quatro formas de se fazer presente" },
  { name: "Por dentro do aroma", href: "#experiencia", sub: "Uma história em três tempos" },
  { name: "Seu encontro", href: "#descoberta", sub: "Um ateliê de possibilidades" },
  { name: "Conversas reais", href: "#relatos", sub: "O que fica depois do primeiro encontro" },
];

export function MaisonHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, "change", value => setScrolled(value > 100));
  useEffect(() => {
    if (!open) return;
    const menu = dialog.current;
    if (!menu) return;
    const previous = document.body.style.overflow;
    menu.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      menu.close();
      document.body.style.overflow = previous;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open]);
  return <>
    <header className={`maison-header ${scrolled ? "is-scrolled" : ""}`}>
      <a href="#conteudo" className="maison-wordmark" aria-label="Cairo’s Parfum — início">CAIRO’S<span>PARFUM</span></a>
      <span className="maison-header-caption">O INVISÍVEL DEIXA MARCA.</span>
      <div className="maison-header-actions"><a href="#descoberta">Encontre seu perfume <ArrowUpRight size={15}/></a><button ref={trigger} onClick={() => setOpen(true)} aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? "maison-menu" : undefined}><span>Menu</span><span className="menu-lines" aria-hidden="true"/></button></div>
      <motion.div className="maison-reading-progress" style={{ scaleX: scrollYProgress }}/>
    </header>
    {open && <dialog id="maison-menu" ref={dialog} className="maison-menu" aria-label="Explore Cairo’s Parfum" onCancel={() => setOpen(false)}>
      <div className="maison-menu-top"><span className="maison-wordmark">CAIRO’S<span>PARFUM</span></span><button onClick={() => setOpen(false)} aria-label="Fechar menu"><X size={24}/></button></div>
      <p className="maison-kicker">ESCOLHA POR ONDE SENTIR.</p>
      <nav>{chapters.map((chapter, index) => <a key={chapter.href} href={chapter.href} onClick={() => setOpen(false)}><span>0{index + 1}</span><div>{chapter.name}<small>{chapter.sub}</small></div><ArrowUpRight size={24}/></a>)}</nav>
      <div className="maison-menu-bottom"><span>Perfumes importados.<br/>Encontros pessoais.</span><a href="https://www.instagram.com/cairosparfum/" target="_blank" rel="noopener noreferrer">@cairosparfum <ArrowUpRight size={16}/></a></div>
    </dialog>}
  </>;
}

export function CampaignHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.17]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  return <section ref={ref} className="campaign" aria-labelledby="campaign-title">
    <motion.div className="campaign-photo" style={reduced ? {} : {y, scale}}><Image src="/images/hero-campaign.webp" alt="Khamrah Qahwa em uma composição de luz âmbar e seda bordô" fill preload sizes="100vw" /></motion.div>
    <div className="campaign-shade"/>
    <motion.div className="campaign-heading" style={reduced ? {} : {y:textY}}>
      <div className="campaign-edition"><span className="maison-kicker">CAIRO’S PARFUM — EXPERIÊNCIA OLFATIVA</span><span>VOL. 01</span></div>
      <h1 id="campaign-title">O invisível<br/>deixa <em>marca.</em></h1>
      <p>Antes da primeira palavra.<br/>Depois do último encontro.</p>
    </motion.div>
    <div className="campaign-product"><span>EM CENA</span><span>Khamrah Qahwa <i>Lattafa · Eau de parfum</i></span></div>
    <div className="campaign-bottom">
      <a href="#perfumes" className="campaign-enter"><span>Entre na coleção</span><ArrowDown size={19}/></a>
      <a href="#descoberta" className="campaign-discover">Qual perfume conta a sua história? <ArrowUpRight size={16}/></a>
      <span className="campaign-location">TAUBATÉ, SP<br/>PARA ONDE VOCÊ FOR.</span>
    </div>
  </section>;
}

export function BrandPrelude() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({target:ref, offset:["start 90%", "end 55%"]});
  const x = useTransform(scrollYProgress,[0,1],[70,-70]);
  return <section ref={ref} className="brand-prelude" aria-label="A nossa forma de escolher">
    <div className="prelude-top"><span className="maison-kicker">CURADORIA COM PERSONALIDADE</span><span className="prelude-symbol" aria-hidden="true">c.</span></div>
    <p>Uma fragrância não precisa dizer tudo.<br/><em>Só precisa dizer você.</em></p>
    <div className="prelude-bottom"><span>Da primeira nota à lembrança que fica.<br/>Explore, descubra, encontre a sua presença.</span><a href="#perfumes">Siga os seus sentidos <ArrowDown size={17}/></a></div>
    <div className="prelude-marquee" aria-label="Lattafa, Al Wataniah, Lattafa Pride, Maison Alhambra"><motion.div aria-hidden="true" style={reduced?{}:{x}}>LATTAFA <i>·</i> AL WATANIAH <i>·</i> LATTAFA PRIDE <i>·</i> MAISON ALHAMBRA</motion.div></div>
  </section>;
}

const scentChapters = [
  { name:"O primeiro instante", word:"Desperta.", title:"Tudo começa com uma faísca.", description:"O frescor encontra o calor. As especiarias dão o primeiro sinal de uma presença que não passa despercebida.", label:"ABERTURA", color:"#f0d1a1", notes:[{name:"Gengibre",text:"Uma faceta fresca e picante. É a energia do primeiro encontro."},{name:"Canela",text:"Quente e especiada, traz uma sensação envolvente à abertura."},{name:"Cardamomo",text:"Aromático e levemente fresco. Acrescenta contraste ao calor das especiarias."}] },
  { name:"O que se revela", word:"Envolve.", title:"A proximidade muda tudo.", description:"O pralinê encontra flores brancas e frutas cristalizadas. A composição ganha corpo, textura e novas camadas.", label:"CORAÇÃO", color:"#edc6c3", notes:[{name:"Pralinê",text:"Uma nota gourmand que evoca açúcar e castanhas. Doçura com textura."},{name:"Flores brancas",text:"Um lado floral ilumina a composição e cria contraste com o pralinê."},{name:"Frutas cristalizadas",text:"Uma faceta frutada e doce que acompanha o coração da fragrância."}] },
  { name:"A memória que fica", word:"Permanece.", title:"Você vai. A lembrança fica.", description:"Café arábica, baunilha e fava tonka encontram musk e benjoim. Um fundo profundo, quente e acolhedor.", label:"FUNDO", color:"#c99a72", notes:[{name:"Café arábica",text:"Torrado e aromático. Uma nuance que dá personalidade ao fundo do Qahwa."},{name:"Baunilha",text:"Doçura macia e envolvente. Une as notas e prolonga a sensação de aconchego."},{name:"Fava tonka",text:"Uma faceta amendoada e quente, com nuances que lembram baunilha."}] },
];

const compactViewportQuery = "(max-height: 740px)";

function subscribeToCompactViewport(onChange: () => void) {
  const media = window.matchMedia(compactViewportQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getCompactViewportSnapshot() {
  return window.matchMedia(compactViewportQuery).matches;
}

function getServerCompactViewportSnapshot() {
  return false;
}

export function ScentJourney() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const compactViewport = useSyncExternalStore(subscribeToCompactViewport, getCompactViewportSnapshot, getServerCompactViewportSnapshot);
  const manualChapters = reduced || compactViewport;
  const [active, setActive] = useState(0);
  const [note, setNote] = useState<number | null>(null);
  const lastChapter = useRef(0);
  const { scrollYProgress } = useScroll({target:ref, offset:["start start","end end"]});
  const photoScale = useTransform(scrollYProgress,[0,.5,1],[1.05,1.3,1.12]);
  const photoX = useTransform(scrollYProgress,[0,1],["0%","-12%"]);
  const photoY = useTransform(scrollYProgress,[0,1],["0%","-6%"]);
  useMotionValueEvent(scrollYProgress,"change",value=>{
    if (manualChapters) return;
    const next = Math.min(2,Math.floor(value*3));
    if (lastChapter.current !== next) {
      lastChapter.current = next;
      setNote(null);
      setActive(next);
    }
  });
  function goTo(index:number) {
    setNote(null);
    setActive(index);
    lastChapter.current = index;
    if(manualChapters || !ref.current) return;
    const section=ref.current;
    window.scrollTo({top:window.scrollY+section.getBoundingClientRect().top+(section.offsetHeight-window.innerHeight)*((index+.3)/3),behavior:"smooth"});
  }
  const chapter=scentChapters[active];
  return <>
    <section className={`scent-journey ${manualChapters?"journey-reduced":""}`} id="experiencia" ref={ref} aria-labelledby="journey-title">
      <div className={`journey-stage journey-scene-${active}`}>
        <motion.div className="journey-image" style={manualChapters?{}:{scale:photoScale,x:photoX,y:photoY}}><Image src="/images/sensory-material.webp" alt="" fill sizes="100vw"/></motion.div>
        <div className="journey-wash"/>
        <div className="journey-top"><span className="maison-kicker" id="journey-title">A ANATOMIA DE UM ENCONTRO</span><span>KHAMRAH QAHWA<br/>LATTAFA</span></div>
        <div className="journey-chapters" aria-label="Evolução da fragrância">{scentChapters.map((scene,index)=><button key={scene.label} onClick={()=>goTo(index)} aria-current={active===index?"step":undefined}><span>0{index+1}</span>{scene.label}<i/></button>)}</div>
        <div className="journey-display" aria-hidden="true"><AnimatePresence mode="wait"><motion.span key={active} initial={reduced?false:{opacity:0,y:32}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:reduced?0:.45}} style={{color:chapter.color}}>{chapter.word}</motion.span></AnimatePresence><span className="journey-margin-note">UM PERFUME. MUITAS SENSAÇÕES.</span></div>
        <div className="journey-editorial">
          <span className="journey-numeral">0{active+1}<small>/ 03</small></span>
          <div className="journey-copy" aria-live="polite"><span className="maison-kicker">{chapter.name}</span><h2>{chapter.title}</h2><p>{chapter.description}</p></div>
          <div className="journey-note-area"><span className="journey-note-hint">TOQUE EM UMA NOTA PARA DESCOBRIR</span><div className="journey-notes">{chapter.notes.map((ingredient,index)=><button key={ingredient.name} aria-expanded={note===index} aria-controls="journey-note-description" onClick={()=>setNote(note===index?null:index)}>{ingredient.name}<Plus size={14} className={note===index?"rotated":""}/></button>)}</div><div id="journey-note-description" className={`journey-note-description ${note!==null?"has-note":""}`} aria-live="polite">{note!==null ? chapter.notes[note].text : "Explore as notas. Perceba as camadas."}</div></div>
        </div>
        <div className="journey-foot"><span><ArrowDown size={14}/> {manualChapters?"ESCOLHA UM CAPÍTULO":"ROLE PARA REVELAR"}</span><a href="#descoberta">Encontre o seu encontro <ArrowUpRight size={15}/></a></div>
      </div>
    </section>
    <div className="journey-outro"><span>O resto da história<br/><em>acontece na sua pele.</em></span><ContactButton className="maison-link" message={productMessage("Khamrah Qahwa")}>Conhecer o Qahwa <ArrowUpRight size={19}/></ContactButton><small>A percepção e a evolução de uma fragrância variam em cada pele.</small></div>
  </>;
}

export function Voices() {
  const [active,setActive]=useState(0);
  const reduced=useReducedMotion();
  const item=testimonials[active];
  return <section className="voices" id="relatos" aria-labelledby="voices-title">
    <div className="voices-heading"><span className="maison-kicker">ECOS DE UM ENCONTRO</span><h2 id="voices-title">Algumas palavras.<br/><em>Muita presença.</em></h2><p>Histórias que chegaram pelo WhatsApp.<br/>E ficaram com a gente.</p><div className="voices-arrows"><button aria-label="Relato anterior" onClick={()=>setActive((active+2)%3)}><ArrowLeft size={20}/></button><button aria-label="Próximo relato" onClick={()=>setActive((active+1)%3)}><ArrowRight size={20}/></button></div></div>
    <div className="voices-paper" aria-roledescription="carrossel" aria-label="Relatos de clientes"><div className="voices-paper-top"><span>CAIRO’S / CONVERSAS REAIS</span><span>0{active+1} — 03</span></div><span className="voices-quote-mark" aria-hidden="true">“</span><AnimatePresence mode="wait"><motion.figure key={active} initial={reduced?false:{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:reduced?0:.2}} aria-live="polite"><blockquote>{item.quote.replace(/[“”]/g,"")}</blockquote><figcaption><strong>{item.product}</strong><span>{item.context}</span></figcaption></motion.figure></AnimatePresence><div className="voices-paper-bottom"><span>Relato individual compartilhado com a marca.</span><span aria-hidden="true">↗</span></div></div>
    <a className="voices-instagram" href="https://www.instagram.com/cairosparfum/" target="_blank" rel="noopener noreferrer">Mais histórias, todos os dias. <strong>@cairosparfum</strong><ArrowUpRight size={16}/></a>
  </section>;
}
