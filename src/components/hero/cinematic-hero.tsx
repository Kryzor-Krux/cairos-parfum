'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { loadGsap } from '@/lib/motion/runtime';

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (disposed || !root.current) return;
      const section = root.current;
      const media = gsap.matchMedia();
      media.add({ motion: '(prefers-reduced-motion: no-preference)', tall: '(min-height: 760px)' }, context => {
        if (!context.conditions?.motion) return;
        const entrance = gsap.context(() => {
          gsap.fromTo('.cinema-line > span', { yPercent: 110 }, { yPercent: 0, stagger: .11, duration: 1.05, ease: 'power3.out', clearProps: 'transform' });
          gsap.fromTo('.cinema-meta, .cinema-intro, .cinema-footer', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .8, delay: .35, stagger: .1, clearProps: 'transform,opacity' });
        }, section);
        if (!context.conditions?.tall) return () => entrance.revert();
        section.classList.add('cinema-enhanced');
        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section, pin: section.querySelector('.cinema-stage'), start: 'top top',
            end: () => `+=${window.innerHeight * (window.innerWidth < 768 ? 1.25 : 1.6)}`,
            scrub: .6, invalidateOnRefresh: true,
          },
        });
        timeline.to('.cinema-photo', { scale: 1.22, xPercent: -3, duration: 1 }, 0)
          .to('.cinema-heading', { y: -80, opacity: 0, duration: .3 }, .08)
          .to('.cinema-mist', { xPercent: 20, opacity: .5, duration: .5 }, 0)
          .to('.cinema-curtain', { opacity: 1, duration: .4 }, .45)
          .fromTo('.cinema-object', { y: 90, rotate: -5, scale: .86, opacity: 0 }, { y: 0, rotate: 0, scale: 1, opacity: 1, duration: .45 }, .5)
          .fromTo('.cinema-manifesto', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .35 }, .62)
          .to('.cinema-footer', { color: '#433329', borderColor: '#43332955', duration: .3 }, .5)
          .to('.cinema-scroll-line > i', { scaleY: 1, duration: 1 }, 0);
        ScrollTrigger.refresh();
        return () => { timeline.scrollTrigger?.kill(); timeline.revert(); entrance.revert(); section.classList.remove('cinema-enhanced'); };
      }, section);
      cleanup = () => media.revert();
    }).catch(() => {});
    return () => { disposed = true; cleanup?.(); };
  }, []);

  return <section ref={root} className="cinema" aria-labelledby="cinema-title" data-analytics-view="hero_view">
    <div className="cinema-stage">
      <div className="cinema-photo"><Image src="/images/hero-campaign.webp" alt="Khamrah Qahwa entre luz âmbar e seda bordô" fill preload unoptimized sizes="100vw"/></div>
      <div className="cinema-shade" aria-hidden="true"/>
      <div className="cinema-mist" aria-hidden="true"/>
      <div className="cinema-heading">
        <div className="cinema-meta"><span className="maison-kicker">PERFUMES IMPORTADOS · PRESENÇAS SINGULARES</span><span>VOL. 01</span></div>
        <h1 id="cinema-title" aria-label="O invisível deixa marca."><span className="cinema-line" aria-hidden="true"><span>O invisível</span></span><span className="cinema-line" aria-hidden="true"><span>deixa <em>marca.</em></span></span></h1>
        <p className="cinema-intro">Antes da primeira palavra.<br/>Depois do último encontro.</p>
      </div>
      <div className="cinema-curtain" aria-hidden="true"/>
      <div className="cinema-object" aria-hidden="true"><Image src="/images/qahwa.webp" alt="" fill sizes="(max-width: 767px) 720px, 1100px"/></div>
      <div className="cinema-manifesto"><span className="maison-kicker">A PRESENÇA COMEÇA NO INVISÍVEL.</span><p>Não é sobre<br/>ser lembrado.<br/><em>É sobre ser você.</em></p><span>Um encontro entre a sua história<br/>e uma nova forma de sentir.</span></div>
      <div className="cinema-footer">
        <a className="cinema-enter" href="#perfumes">Explore a coleção <ArrowDown size={20}/></a>
        <a className="cinema-discover" href="#descoberta">Encontre sua assinatura <ArrowUpRight size={18}/></a>
        <div className="cinema-caption"><span>EM CENA / KHAMRAH QAHWA</span><span>Lattafa · Eau de parfum</span></div>
      </div>
      <div className="cinema-scroll-line" aria-hidden="true"><i/></div>
    </div>
  </section>;
}
