import { ArrowUpRight, ArrowUp, MapPin } from "lucide-react";
import { ExperienceProvider, ContactButton, StickyContact, FAQ } from "@/components/experience";
import { MaisonHeader, CampaignHero, BrandPrelude, ScentJourney, Voices } from "@/components/maison";
import { PerfumeGallery } from "@/components/perfume-gallery";
import { ScentAtelier } from "@/components/scent-atelier";

export default function Home() {
  return <ExperienceProvider>
    <MaisonHeader/>
    <main id="conteudo">
      <CampaignHero/>
      <BrandPrelude/>
      <PerfumeGallery/>
      <ScentJourney/>
      <ScentAtelier/>
      <Voices/>
      <section className="maison-contact" id="atendimento">
        <div><span className="maison-kicker">DE PESSOA PARA PESSOA</span><h2>Seu próximo<br/>encontro.<br/><em>Vamos descobrir?</em></h2><p>Um aroma que você adora. Uma ocasião especial. Ou só a vontade de encontrar algo novo. A gente começa por aí.</p><ContactButton>Começar uma conversa <ArrowUpRight size={18}/></ContactButton><div className="delivery-note"><MapPin size={19}/><div><strong>Taubaté e região: entrega por nossa conta.</strong><span>Consulte a cobertura do seu endereço no atendimento.</span></div></div></div>
        <div><span className="maison-kicker">ANTES DA PRIMEIRA ESCOLHA</span><FAQ/></div>
      </section>
    </main>
    <footer className="maison-footer"><div className="maison-footer-top"><span>PERFUMES IMPORTADOS.<br/>PRESENÇAS SINGULARES.</span><a href="#conteudo">DE VOLTA AO INÍCIO <ArrowUp size={17}/></a></div><div className="maison-footer-word" aria-label="Cairo’s">CAIRO’S</div><div className="maison-footer-bottom"><span>© {new Date().getFullYear()} Cairo’s Parfum.<br/>O invisível deixa marca.</span><a href="https://www.instagram.com/cairosparfum/" target="_blank" rel="noopener noreferrer">INSTAGRAM ↗<br/>@cairosparfum</a></div></footer>
    <StickyContact/>
  </ExperienceProvider>;
}
