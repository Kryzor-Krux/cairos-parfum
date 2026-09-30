import { ArrowUp } from 'lucide-react';

export function MaisonFooter() {
  return <footer className="maison-footer"><div className="maison-footer-top"><span>PERFUMES IMPORTADOS.<br/>PRESENÇAS SINGULARES.</span><a href="#conteudo">VOLTAR AO INÍCIO <ArrowUp size={18}/></a></div><div className="maison-footer-word" aria-label="Cairo’s">CAIRO’S</div><div className="maison-footer-bottom"><span>© {new Date().getFullYear()} Cairo’s Parfum.<br/>O invisível deixa marca.</span><a href="https://www.instagram.com/cairosparfum/" data-analytics-event="instagram_click" data-analytics-source="footer" target="_blank" rel="noopener noreferrer">INSTAGRAM ↗<br/>@cairosparfum</a></div></footer>;
}
