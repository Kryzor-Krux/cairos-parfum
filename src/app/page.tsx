import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Instagram,
  MapPin,
  MessageCircle,
  PackageCheck,
  Quote,
  Sparkles,
} from "lucide-react";
import {
  ExperienceProvider,
  Header,
  HeroProduct,
  ContactButton,
  Catalog,
  Discovery,
  StickyContact,
  FAQ,
} from "@/components/experience";
import { NotesStory, Manifesto } from "@/components/immersive";
import { testimonials } from "@/data/perfumes";

export default function Home() {
  return (
    <ExperienceProvider>
      <Header />
      <main id="conteudo">
        <section className="hero" aria-labelledby="hero-title">
          <Image
            className="hero-background"
            src="/images/atmosphere.webp"
            fill
            priority
            sizes="100vw"
            alt=""
          />
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span /> PERFUMARIA QUE DESPERTA
            </div>
            <h1 id="hero-title">
              Presença
              <br />
              que <em>fica.</em>
            </h1>
            <p>
              Há perfumes que você usa.
              <br />E outros que se tornam parte de você.
            </p>
            <div className="hero-actions">
              <a href="#perfumes" className="button dark">
                Encontre sua assinatura <ArrowUpRight size={18} />
              </a>
              <a href="#experiencia" className="hero-secondary">
                Sinta a experiência <ArrowDown size={15} />
              </a>
            </div>
            <span className="hero-caption">
              PERFUMES IMPORTADOS. ESCOLHAS COM PERSONALIDADE.
            </span>
          </div>
          <HeroProduct />
          <div className="hero-bottom">
            <span>UMA NOVA FORMA DE SE FAZER PRESENTE</span>
            <a href="#perfumes" aria-label="Descer para a seleção">
              <ArrowDown size={17} />
            </a>
            <span>TAUBATÉ · SÃO PAULO</span>
          </div>
        </section>
        <div className="brand-strip" aria-label="Marcas presentes na seleção">
          <span>
            ESCOLHAS QUE
            <br />
            VALEM A DESCOBERTA
          </span>
          <p className="brand-lattafa">Lattafa</p>
          <p className="brand-wataniah">AL WATANIAH</p>
          <p className="brand-pride">
            LATTAFA <i>PRIDE</i>
          </p>
          <p className="brand-alhambra">MAISON ALHAMBRA</p>
        </div>
        <section id="perfumes" className="catalog section-pad">
          <Catalog />
        </section>
        <Manifesto />
        <NotesStory />
        <section id="relatos" className="testimonials section-pad">
          <div className="section-heading">
            <div>
              <span className="eyebrow">03 — HISTÓRIAS QUE CHEGAM ATÉ NÓS</span>
              <h2>
                O frasco é nosso assunto.
                <br />
                <em>A experiência é sua.</em>
              </h2>
            </div>
            <p className="section-aside">
              Algumas palavras que recebemos
              <br />
              de quem já escolheu a Cairo’s.
            </p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((t, i) => (
              <figure key={t.product} className="testimonial">
                <div className="testimonial-top">
                  <Quote size={24} strokeWidth={1} />
                  <span>0{i + 1}</span>
                </div>
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  <span className="testimonial-dot" />
                  <div>
                    <strong>{t.product}</strong>
                    <span>{t.context}</span>
                  </div>
                  <MessageCircle size={17} strokeWidth={1.2} />
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="testimonials-foot">
            <span>Relatos individuais compartilhados com a marca.</span>
            <a
              href="https://www.instagram.com/cairosparfum/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mais histórias no Instagram <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
        <Discovery />
        <section id="atendimento" className="contact-section section-pad">
          <div className="contact-main">
            <span className="eyebrow">PERTO DE VOCÊ, EM CADA ESCOLHA</span>
            <h2>
              Seu próximo perfume
              <br />
              começa com <em>uma conversa.</em>
            </h2>
            <p>
              Uma ocasião, uma lembrança, um aroma que você adora.
              <br />
              Conte para a gente. Vamos descobrir sua próxima presença.
            </p>
            <ContactButton className="button dark">
              Vamos conversar <ArrowUpRight size={18} />
            </ContactButton>
            <div className="delivery-note">
              <MapPin size={19} strokeWidth={1.4} />
              <div>
                <strong>Taubaté e região: entrega por nossa conta.</strong>
                <span>
                  Consulte a cobertura do seu endereço no atendimento.
                </span>
              </div>
            </div>
          </div>
          <div className="contact-side">
            <span className="eyebrow">BOM SABER</span>
            <FAQ />
            <a
              className="instagram-link"
              href="https://www.instagram.com/cairosparfum/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={20} strokeWidth={1.3} />
              <span>
                Acompanhe nossas descobertas<strong>@cairosparfum</strong>
              </span>
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </main>
      <footer className="footer">
        <a href="#" className="wordmark footer-wordmark">
          CAIRO’S<span>PARFUM</span>
        </a>
        <p>Presença que fica.</p>
        <div>
          <span>© {new Date().getFullYear()} Cairo’s Parfum</span>
          <a href="#conteudo">Voltar ao início ↑</a>
        </div>
      </footer>
      <StickyContact />
    </ExperienceProvider>
  );
}
