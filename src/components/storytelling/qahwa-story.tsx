'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Plus } from 'lucide-react';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import { loadGsap } from '@/lib/motion/runtime';
import { scrollSceneTo } from '@/lib/motion/scroll';
import { motionTokens } from '@/lib/motion/tokens';
import { scentChapters, noteDescriptions } from '@/data/scent-story';
import { ImageSequence, type ImageSequenceHandle } from './image-sequence';
import { ContactButton } from '@/components/experience';
import { productMessage } from '@/lib/contact';

export function QahwaStory() {
  const root = useRef<HTMLElement>(null);
  const sequence = useRef<ImageSequenceHandle>(null);
  const trigger = useRef<ScrollTriggerType | null>(null);
  const last = useRef(0);
  const [active, setActive] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const reduced = useReducedMotion();
  const chapter = scentChapters[active];

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void loadGsap().then(({ gsap, ScrollTrigger }) => {
        if (disposed) return;
        const media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference) and (min-height: 820px)', () => {
          element.dataset.pinned = 'true';
          setPinned(true);
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: element, pin: element.querySelector('.qahwa-stage'), start: 'top top',
              end: () => `+=${innerHeight * (innerWidth < 768 ? 1.7 : 2.1)}`,
              scrub: .6, invalidateOnRefresh: true,
              onUpdate: self => {
                sequence.current?.seek(self.progress);
                const next = Math.min(2, Math.floor(self.progress * 3));
                if (next !== last.current) { last.current = next; setActive(next); setNote(null); }
              },
            },
          });
          timeline.fromTo('.qahwa-art-motion', { y: 15, rotate: -4, scale: .94 }, { y: -14, rotate: 3, scale: 1.07, duration: 1 }, 0)
            .fromTo('.qahwa-light', { xPercent: -18, opacity: .4 }, { xPercent: 22, opacity: .85, duration: 1 }, 0)
            .fromTo('.qahwa-material', { scale: 1.05, yPercent: 0 }, { scale: 1.17, yPercent: -4, duration: 1 }, 0)
            .fromTo('.qahwa-progress i', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
          trigger.current = timeline.scrollTrigger ?? null;
          ScrollTrigger.refresh();
          return () => { trigger.current = null; timeline.scrollTrigger?.kill(); timeline.revert(); delete element.dataset.pinned; setPinned(false); };
        }, element);
        cleanup = () => media.revert();
      }).catch(() => {});
    }, { rootMargin: '600px 0px' });
    observer.observe(element);
    return () => { disposed = true; observer.disconnect(); cleanup?.(); };
  }, []);

  const chooseChapter = (index: number) => {
    setNote(null);
    const scene = trigger.current;
    if (scene) scrollSceneTo(scene.start + (scene.end - scene.start) * ((index + .35) / 3));
    else { last.current = index; setActive(index); sequence.current?.seek(index / 2); }
  };

  return <>
    <section ref={root} className={`qahwa-story qahwa-tone-${active} ${pinned ? 'qahwa-pinned' : 'qahwa-manual'}`} id="experiencia" aria-labelledby="qahwa-title">
      <div className="qahwa-stage">
        <div className="qahwa-material"><Image src="/images/sensory-material.webp" alt="" fill sizes="100vw"/></div>
        <div className="qahwa-shade" aria-hidden="true"/>
        <div className="qahwa-top"><span className="maison-kicker" id="qahwa-title">POR DENTRO DE UM ENCONTRO</span><span>KHAMRAH QAHWA<br/>LATTAFA / 100 ML</span></div>
        <nav className="qahwa-chapters" aria-label="Evolução da fragrância">{scentChapters.map((item, index) => <button key={item.label} onClick={() => chooseChapter(index)} aria-current={active === index ? 'step' : undefined}><span>0{index + 1}</span>{item.label}<i/></button>)}</nav>
        <div className="qahwa-art" aria-hidden="true"><span className="qahwa-word">{chapter.word}</span><div className="qahwa-halo"/><div className="qahwa-art-motion"><ImageSequence ref={sequence} fallback={{ src: '/images/qahwa.webp', alt: '', sizes: '(max-width: 767px) 620px, 850px' }} fit="contain" className="qahwa-sequence"/></div><div className="qahwa-light"/><span className="qahwa-art-caption">UMA COMPOSIÇÃO. MUITAS SENSAÇÕES.</span></div>
        <div className="qahwa-editorial">
          <div className="qahwa-copy" aria-live="polite"><span className="maison-kicker">0{active + 1} / {chapter.label}</span><AnimatePresence mode="wait" initial={false}><motion.div key={active} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -6 }} transition={{ duration: reduced ? 0 : motionTokens.duration.quick }}><h2>{chapter.title}</h2><p>{chapter.description}</p></motion.div></AnimatePresence></div>
          <div className="qahwa-notes"><span className="qahwa-note-hint">EXPLORE AS NOTAS</span><div className="qahwa-note-buttons" data-native-scroll>{chapter.notes.map(ingredient => <button key={ingredient} aria-expanded={note === ingredient} aria-controls="qahwa-note-info" onClick={() => setNote(note === ingredient ? null : ingredient)}>{ingredient}<Plus size={15} className={note === ingredient ? 'rotated' : ''}/></button>)}</div><p id="qahwa-note-info" aria-live="polite">{note ? noteDescriptions[note] : 'Toque em uma nota e descubra sua faceta.'}</p></div>
        </div>
        <div className="qahwa-bottom"><span><ArrowDown size={16}/>{pinned ? 'ROLE PARA REVELAR' : 'ESCOLHA UM CAPÍTULO'}</span><a href="#descoberta">Encontre o seu <ArrowUpRight size={17}/></a></div>
        <div className="qahwa-progress" aria-hidden="true"><i/></div>
      </div>
    </section>
    <div className="qahwa-outro"><p>O resto da história<br/><em>acontece na sua pele.</em></p><div><ContactButton message={productMessage('Khamrah Qahwa')} className="maison-link">Conhecer o Qahwa <ArrowUpRight size={20}/></ContactButton><small>A percepção e a evolução variam em cada pele.</small></div></div>
  </>;
}
