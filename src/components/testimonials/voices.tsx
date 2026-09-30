import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { testimonials } from "@/data/perfumes";
import "@/app/voices.css";

export type TestimonialEvidence = (typeof testimonials)[number] & {
  screenshot?: { src: string; alt: string; width: number; height: number };
};

export function Voices({ evidence = testimonials }: { evidence?: readonly TestimonialEvidence[] }) {
  return <section className="evidence" id="relatos" aria-labelledby="evidence-title">
    <div className="evidence-heading">
      <span className="evidence-kicker">O QUE VOLTA PARA A GENTE</span>
      <h2 id="evidence-title">Da conversa.<br /><em>Para a memória.</em></h2>
      <p>Depois do primeiro encontro com um perfume, vêm as palavras. Estas chegaram até a Cairo’s.</p>
    </div>
    <div className="evidence-wall" aria-label="Trechos reais de conversas com clientes">
      {evidence.map((item, index) => <figure className={`evidence-fragment evidence-fragment-${index + 1}`} key={`${item.product}-${item.page}`}>
        <div className="evidence-fragment-top"><span>DA CONVERSA</span><span aria-hidden="true">0{index + 1}</span></div>
        {item.screenshot ? <div className="evidence-screenshot"><Image src={item.screenshot.src} alt={item.screenshot.alt} width={item.screenshot.width} height={item.screenshot.height} sizes="(max-width: 767px) 90vw, 40vw" /></div> : null}
        <blockquote><span className="evidence-open-quote" aria-hidden="true">“</span>{item.quote.replace(/[“”]/g, "")}<span className="evidence-close-quote" aria-hidden="true">”</span></blockquote>
        <figcaption><span>Sobre <strong>{item.product}</strong></span><small>{item.context}</small></figcaption>
        <span className="evidence-corner" aria-hidden="true" />
      </figure>)}
    </div>
    <div className="evidence-bottom">
      <p>Trechos de conversas reais compartilhadas com a marca. São experiências individuais: a percepção de um perfume varia em cada pele.</p>
      <a href="https://www.instagram.com/cairosparfum/" target="_blank" rel="noopener noreferrer" data-analytics-event="instagram_click" data-analytics-source="voices"><span>Continue no nosso universo<strong>@cairosparfum</strong></span><ArrowUpRight size={23} /></a>
    </div>
  </section>;
}
