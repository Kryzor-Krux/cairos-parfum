'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';

const chapters = [
  { name: 'A coleção', href: '#perfumes', sub: 'Quatro formas de se fazer presente' },
  { name: 'Por dentro do aroma', href: '#experiencia', sub: 'Uma história em três tempos' },
  { name: 'Seu encontro', href: '#descoberta', sub: 'Um ateliê de possibilidades' },
  { name: 'Conversas reais', href: '#relatos', sub: 'O que fica depois do primeiro encontro' },
];

export function MaisonHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrolled = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, 'change', value => {
    const next = value > 90;
    if (next !== lastScrolled.current) { lastScrolled.current = next; setScrolled(next); }
  });
  useEffect(() => {
    if (!open) return;
    const menu = dialog.current;
    const overflow = document.body.style.overflow;
    menu?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { menu?.close(); document.body.style.overflow = overflow; trigger.current?.focus({ preventScroll: true }); };
  }, [open]);

  return <>
    <header className={`maison-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#conteudo" className="maison-wordmark" aria-label="Cairo’s Parfum — início">CAIRO’S<span>PARFUM</span></a>
      <span className="maison-header-caption">O INVISÍVEL DEIXA MARCA.</span>
      <div className="maison-header-actions"><a href="#descoberta">Encontre seu perfume <ArrowUpRight size={16}/></a><button ref={trigger} onClick={() => setOpen(true)} aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? 'maison-menu' : undefined}><span>Menu</span><span className="menu-lines" aria-hidden="true"/></button></div>
      <motion.div aria-hidden="true" className="maison-reading-progress" style={{ scaleX: scrollYProgress }}/>
    </header>
    {open && <dialog id="maison-menu" ref={dialog} className="maison-menu" aria-label="Explore Cairo’s Parfum" onCancel={() => setOpen(false)}>
      <div className="maison-menu-top"><span className="maison-wordmark">CAIRO’S<span>PARFUM</span></span><button onClick={() => setOpen(false)} aria-label="Fechar menu"><X size={24}/></button></div>
      <p className="maison-kicker">ESCOLHA POR ONDE SENTIR.</p>
      <nav>{chapters.map((chapter, index) => <motion.a key={chapter.href} href={chapter.href} initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .35, delay: reduced ? 0 : index * .05 }} onClick={() => setOpen(false)}><span>0{index + 1}</span><div>{chapter.name}<small>{chapter.sub}</small></div><ArrowUpRight size={24}/></motion.a>)}</nav>
      <div className="maison-menu-bottom"><span>Perfumes importados.<br/>Encontros pessoais.</span><a href="https://www.instagram.com/cairosparfum/" data-analytics-event="instagram_click" data-analytics-source="menu" target="_blank" rel="noopener noreferrer">@cairosparfum <ArrowUpRight size={16}/></a></div>
    </dialog>}
  </>;
}
