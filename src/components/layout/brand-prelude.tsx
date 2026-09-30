import { ArrowDown } from 'lucide-react';
import { RevealText } from '@/components/motion/reveal';

export function BrandPrelude() {
  return <section className="brand-prelude" aria-label="A nossa forma de escolher">
    <div className="prelude-top"><span className="maison-kicker">CURADORIA COM PERSONALIDADE</span><span className="prelude-symbol" aria-hidden="true">c.</span></div>
    <RevealText as="p" text={"Uma fragrância não precisa dizer tudo.\nSó precisa dizer você."} split="lines" className="prelude-statement"/>
    <div className="prelude-bottom"><p>Da primeira nota à lembrança que fica.<br/>Explore, descubra, encontre a sua presença.</p><a href="#perfumes">Siga os seus sentidos <ArrowDown size={18}/></a></div>
    <div className="prelude-brands" aria-label="Marcas da seleção"><span>LATTAFA</span><i aria-hidden="true">·</i><span>AL WATANIAH</span><i aria-hidden="true">·</i><span>LATTAFA PRIDE</span></div>
  </section>;
}
