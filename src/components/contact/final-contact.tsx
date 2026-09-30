import Image from 'next/image';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { ContactButton, FAQ } from '@/components/experience';
import { RevealText } from '@/components/motion/reveal';

export function FinalContact() {
  return <section className="final-contact" id="atendimento" aria-labelledby="contact-title">
    <div className="final-scene">
      <Image src="/images/sensory-material.webp" alt="" fill sizes="100vw"/>
      <div className="final-scene-shade"/>
      <div className="final-editorial"><span className="maison-kicker">O PRÓXIMO CAPÍTULO É SEU.</span><RevealText id="contact-title" text={"Toda presença\ncomeça com\num encontro."} split="lines"/><p>Conte o que você gosta de sentir.<br/>A gente ajuda a encontrar o resto.</p><ContactButton className="button light">Vamos encontrar seu perfume <ArrowUpRight size={20}/></ContactButton><span className="final-signature">De pessoa para pessoa. Cairo’s Parfum.</span></div>
    </div>
    <div className="contact-details"><div><span className="maison-kicker">PERTINHO DE VOCÊ</span><h3>Da nossa seleção<br/><em>para a sua pele.</em></h3><div className="delivery-note"><MapPin size={22}/><div><strong>Taubaté e região.<br/>Entrega por nossa conta.</strong><span>Confirme a cobertura do seu endereço<br/>e combine os detalhes no atendimento.</span></div></div></div><div><span className="maison-kicker">ANTES DO PRIMEIRO ENCONTRO</span><FAQ/></div></div>
  </section>;
}
