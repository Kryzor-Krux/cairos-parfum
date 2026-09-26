"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Minus,
  MessageCircle,
  Check,
  Menu,
  Sparkles,
  Sun,
  Leaf,
  Flower2,
  Flame,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { contacts, perfumes, type Perfume } from "@/data/perfumes";
import {
  defaultMessage,
  discoveryMessage,
  productMessage,
  whatsappUrl,
} from "@/lib/contact";

type ContactContextType = { openContact: (message?: string) => void };
const ContactContext = createContext<ContactContextType>({
  openContact: () => {},
});

function Dialog({
  children,
  title,
  onClose,
  className = "",
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={`dialog ${className}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) {
          const r = ref.current.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="dialog-close icon-button"
        aria-label="Fechar"
        onClick={onClose}
        title="Fechar"
      >
        <X size={22} />
        <span className="sr-only">Fechar</span>
      </button>
      {children}
    </dialog>
  );
}

export function ExperienceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const openContact = useCallback((text = defaultMessage) => {
    setMessage(text);
  }, []);
  return (
    <ContactContext.Provider value={{ openContact }}>
      {children}
      {message && (
        <Dialog
          title="Escolha seu atendimento"
          onClose={() => setMessage(null)}
          className="contact-dialog"
        >
          <span className="eyebrow">UMA CONVERSA, MUITAS POSSIBILIDADES</span>
          <h2>
            Vamos encontrar
            <br />
            <em>o seu perfume?</em>
          </h2>
          <p>
            Escolha com quem conversar. Sua mensagem já está pronta para levar
            ao WhatsApp.
          </p>
          <div className="message-preview">{message}</div>
          <div className="contact-options">
            {contacts.map((c) => (
              <a
                key={c.name}
                className="contact-option"
                href={whatsappUrl(c.phone, message)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-initial">{c.name[0]}</span>
                <span>
                  <strong>Conversar com {c.name}</strong>
                  <small>Atendimento pelo WhatsApp</small>
                </span>
                <ArrowUpRight size={21} />
              </a>
            ))}
          </div>
          <span className="fine-print">
            Você revisa e envia a mensagem no WhatsApp.
          </span>
        </Dialog>
      )}
    </ContactContext.Provider>
  );
}

export function ContactButton({
  children,
  message,
  className = "button dark",
}: {
  children?: React.ReactNode;
  message?: string;
  className?: string;
}) {
  const { openContact } = useContext(ContactContext);
  return (
    <button className={className} onClick={() => openContact(message)}>
      {children || (
        <>
          Falar no WhatsApp <ArrowUpRight size={17} />
        </>
      )}
    </button>
  );
}

export function Header() {
  const [menu, setMenu] = useState(false);
  return (
    <header className="header">
      <a className="wordmark" href="#" aria-label="Cairo’s Parfum — início">
        CAIRO’S<span>PARFUM</span>
      </a>
      <nav
        aria-label="Navegação principal"
        className={menu ? "nav is-open" : "nav"}
      >
        <a href="#perfumes" onClick={() => setMenu(false)}>
          A seleção
        </a>
        <a href="#experiencia" onClick={() => setMenu(false)}>
          A experiência
        </a>
        <a href="#relatos" onClick={() => setMenu(false)}>
          Quem escolheu
        </a>
      </nav>
      <ContactButton className="header-contact">
        Vamos conversar <ArrowUpRight size={16} />
      </ContactButton>
      <button
        className="mobile-menu icon-button"
        aria-label={menu ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menu}
        onClick={() => setMenu(!menu)}
      >
        {menu ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

export function HeroProduct() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-9, -3]);
  return (
    <div ref={ref} className="hero-visual">
      <div className="hero-orbit" aria-hidden="true" />
      <motion.div className="hero-bottle" style={reduced ? {} : { y, rotate }}>
        <Image
          src="/images/qahwa.webp"
          width={1000}
          height={1000}
          alt="Frasco de Khamrah Qahwa, com vidro facetado e perfume âmbar"
          priority
          sizes="(max-width: 640px) 760px, 1100px"
        />
      </motion.div>
      <span className="hero-product-label">
        <span>EM FOCO</span>Khamrah Qahwa <i>Lattafa · 100 ml</i>
      </span>
      <span className="vertical-note">CAFÉ. ESPECIARIAS. PRESENÇA.</span>
    </div>
  );
}

export function Catalog() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Perfume | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const goTo = (index: number) => {
    const t = track.current;
    if (!t) return;
    const next = Math.max(0, Math.min(perfumes.length - 1, index));
    const item = t.children[next] as HTMLElement;
    t.scrollTo({
      left: item.offsetLeft - (t.clientWidth - item.clientWidth) / 2,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  return (
    <>
      <div className="section-heading">
        <div>
          <span className="eyebrow">01 — A SELEÇÃO</span>
          <h2>
            Qual será a sua
            <br />
            <em>próxima assinatura?</em>
          </h2>
        </div>
        <div className="selection-intro">
          <p>
            Uma coleção de sensações.
            <br />
            Arraste. Sinta. Encontre a sua.
          </p>
          <div className="catalog-controls">
            <span>DESLIZE PARA DESCOBRIR</span>
            <button
              className="icon-button"
              aria-label="Perfume anterior"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              className="icon-button"
              aria-label="Próximo perfume"
              onClick={() => goTo(active + 1)}
              disabled={active === perfumes.length - 1}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
      <div
        className="product-track"
        ref={track}
        onScroll={() => {
          const t = track.current;
          if (t) {
            const children = Array.from(t.children) as HTMLElement[];
            let index = 0;
            let nearest = Infinity;
            children.forEach((c, i) => {
              const d = Math.abs(
                c.offsetLeft +
                  c.clientWidth / 2 -
                  t.scrollLeft -
                  t.clientWidth / 2,
              );
              if (d < nearest) {
                nearest = d;
                index = i;
              }
            });
            setActive(index);
          }
        }}
        role="region"
        aria-roledescription="carrossel"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(active + (e.key === "ArrowRight" ? 1 : -1));
          }
        }}
        aria-label="Seleção de perfumes"
      >
        {perfumes.map((p, index) => (
          <article
            key={p.id}
            className={`product-card ${p.tone} ${active === index ? "is-active" : ""}`}
            aria-label={`${index + 1} de ${perfumes.length}: ${p.name}`}
          >
            <button
              className="product-image-button"
              onClick={() => setSelected(p)}
              aria-label={`Conhecer ${p.name}`}
            >
              <span className="product-number">0{index + 1} / 04</span>
              <span className="card-sensation" aria-hidden="true">
                {["Intenso.", "Livre.", "Radiante.", "Singular."][index]}
              </span>
              <span className="product-pill">{p.family}</span>
              <div className={`product-image ${p.id}`}>
                <Image
                  src={p.image}
                  width={1000}
                  height={1000}
                  sizes="(max-width: 640px) 500px, 650px"
                  alt={`Frasco de ${p.name}, ${p.brand}`}
                />
              </div>
              <span className="product-open">
                <Plus size={20} />
              </span>
            </button>
            <div className="product-info">
              <span className="eyebrow">
                {p.brand} <span>· {p.volume} ML</span>
              </span>
              <h3>{p.name}</h3>
              <div className="product-bottom">
                <p>{p.feeling}</p>
                <button
                  className="text-button"
                  onClick={() => setSelected(p)}
                  aria-label={`Ver detalhes de ${p.name}`}
                >
                  Conhecer <ArrowUpRight size={17} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="carousel-pagination">
        <span aria-live="polite">
          0{active + 1}
          <small> / 04</small>
        </span>
        <div className="carousel-dots">
          {perfumes.map((p, i) => (
            <button
              key={p.id}
              aria-label={`Ir para ${p.name}`}
              aria-current={active === i ? "true" : undefined}
              onClick={() => goTo(i)}
            >
              <span />
            </button>
          ))}
        </div>
        <span className="swipe-hint">
          ARRASTE PARA SENTIR <ArrowRight size={15} />
        </span>
      </div>
      <div className="catalog-bottom">
        <span>
          Uma seleção para descobrir. Consulte valores e disponibilidade.
        </span>
        <a href="#descoberta">
          Ainda não sabe qual escolher? <ArrowRight size={15} />
        </a>
      </div>
      {selected && (
        <Dialog
          title={selected.name}
          onClose={() => setSelected(null)}
          className="product-dialog"
        >
          <div className={`detail-art ${selected.tone} ${selected.id}`}>
            <Image
              src={selected.image}
              width={1000}
              height={1000}
              sizes="(max-width:640px) 600px, 700px"
              alt={`Frasco de ${selected.name}`}
            />
          </div>
          <div className="detail-content">
            <span className="eyebrow">
              {selected.brand} · {selected.concentration}
            </span>
            <h2>{selected.name}</h2>
            <span className="detail-meta">
              {selected.volume} ml <span /> {selected.family}
            </span>
            <p>{selected.description}</p>
            <div className="detail-notes">
              {(
                [
                  ["top", "Abertura"],
                  ["heart", "Coração"],
                  ["base", "Fundo"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <span>{label}</span>
                  <p>{selected.notes[key].join(" · ")}</p>
                </div>
              ))}
            </div>
            <ContactButton message={productMessage(selected.name)}>
              Consultar este perfume <ArrowUpRight size={18} />
            </ContactButton>
            <span className="fine-print">
              Consulte disponibilidade e valor no atendimento.
            </span>
            <a
              className="source-link"
              href={selected.source}
              target="_blank"
              rel="noopener noreferrer"
            >
              Informações do fabricante <ArrowUpRight size={12} />
            </a>
          </div>
        </Dialog>
      )}
    </>
  );
}

const preferences = [
  { name: "Fresco", icon: Sun },
  { name: "Doce", icon: Sparkles },
  { name: "Amadeirado", icon: Leaf },
  { name: "Floral", icon: Flower2 },
  { name: "Especiado", icon: Flame },
  { name: "Ainda não sei", icon: MessageCircle },
];
const occasions = [
  "Dia a dia",
  "Trabalho",
  "Encontro",
  "Noite / festa",
  "Presente",
];
export function Discovery() {
  const [step, setStep] = useState(0);
  const [preference, setPreference] = useState("");
  const [occasion, setOccasion] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const next = (s: number) => {
    setStep(s);
    requestAnimationFrame(() =>
      heading.current?.focus({ preventScroll: true }),
    );
  };
  return (
    <section id="descoberta" className="discovery section-pad">
      <div className="discovery-intro">
        <span className="eyebrow">04 — UM PERFUME, DO SEU JEITO</span>
        <h2>
          Não é sobre ter mais.
          <br />É sobre encontrar
          <br />
          <em>o que é seu.</em>
        </h2>
        <p>
          Duas perguntas para começar.
          <br />
          Uma conversa para descobrir.
        </p>
        <div className="discovery-decoration" aria-hidden="true">
          <span />
          <span />
          <span />
          <Sparkles size={22} strokeWidth={1} />
        </div>
      </div>
      <div className="quiz">
        <div className="quiz-topline">
          <span>SUA DESCOBERTA</span>
          <span>
            {step < 2 ? `0${step + 1} / 02` : "PRONTO PARA CONVERSAR"}
          </span>
        </div>
        <div className="quiz-progress">
          <span style={{ width: step === 0 ? "50%" : "100%" }} />
        </div>
        <motion.div
          key={step}
          initial={reduced ? false : { opacity: 0.3, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {step === 0 ? (
            <>
              <h3 ref={heading} tabIndex={-1}>
                Que sensação
                <br />
                chama sua atenção?
              </h3>
              <div
                className="preference-options"
                role="group"
                aria-label="Perfil de perfume"
              >
                {preferences.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    className={preference === name ? "selected" : ""}
                    aria-pressed={preference === name}
                    onClick={() => setPreference(name)}
                  >
                    <Icon size={20} strokeWidth={1.3} />
                    {name}
                    {preference === name && <Check size={14} />}
                  </button>
                ))}
              </div>
              <button
                className="button dark quiz-next"
                disabled={!preference}
                onClick={() => next(1)}
              >
                Continuar <ArrowRight size={17} />
              </button>
            </>
          ) : step === 1 ? (
            <>
              <h3 ref={heading} tabIndex={-1}>
                Para qual momento
                <br />
                você está procurando?
              </h3>
              <div
                className="occasion-options"
                role="group"
                aria-label="Ocasião"
              >
                {occasions.map((name) => (
                  <button
                    key={name}
                    aria-pressed={occasion === name}
                    className={occasion === name ? "selected" : ""}
                    onClick={() => setOccasion(name)}
                  >
                    {name}
                    {occasion === name ? (
                      <Check size={17} />
                    ) : (
                      <Plus size={15} />
                    )}
                  </button>
                ))}
              </div>
              <button
                className="button dark quiz-next"
                disabled={!occasion}
                onClick={() => next(2)}
              >
                Ver minha escolha <ArrowRight size={17} />
              </button>
              <button className="quiz-back" onClick={() => next(0)}>
                <ArrowLeft size={14} /> Voltar
              </button>
            </>
          ) : (
            <>
              <span className="result-mark">
                <Check size={28} strokeWidth={1} />
              </span>
              <h3 ref={heading} tabIndex={-1}>
                Um bom começo
                <br />
                <em>para algo seu.</em>
              </h3>
              <div className="result-tags">
                <span>{preference}</span>
                <span>{occasion}</span>
              </div>
              <p className="result-copy">
                Vamos levar suas preferências para uma conversa. A gente ajuda a
                encontrar as opções que combinam com você.
              </p>
              <ContactButton
                className="button dark quiz-next"
                message={discoveryMessage(preference, occasion)}
              >
                Receber sugestões <ArrowUpRight size={17} />
              </ContactButton>
              <button className="quiz-back" onClick={() => next(0)}>
                Editar minhas respostas
              </button>
            </>
          )}
        </motion.div>
        <div className="quiz-bottom">
          <span>Sem cadastro. No seu tempo.</span>
          <span>CAIRO’S PARFUM</span>
        </div>
      </div>
    </section>
  );
}

export function StickyContact() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 500);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <nav
      className={`mobile-dock ${visible ? "visible" : ""}`}
      aria-label="Atalhos"
      inert={!visible}
    >
      <a href="#perfumes">
        <Leaf size={18} />
        <span>Seleção</span>
      </a>
      <a href="#descoberta">
        <Sparkles size={18} />
        <span>Descobrir</span>
      </a>
      <ContactButton className="dock-contact">
        Conversar <ArrowUpRight size={18} />
      </ContactButton>
    </nav>
  );
}

export function FAQ() {
  const [active, setActive] = useState<number | null>(null);
  const items = [
    [
      "Como consulto valor e disponibilidade?",
      "Escolha um perfume e toque em “Consultar este perfume”. Sua mensagem abre no WhatsApp com o nome da fragrância. Nossa equipe informa valor e disponibilidade no atendimento.",
    ],
    [
      "Vocês entregam na minha região?",
      "A Cairo’s anuncia entrega grátis em Taubaté e região. Fale com a equipe para confirmar a cobertura do seu endereço e combinar a entrega.",
    ],
    [
      "Ainda não conheço esses perfumes. Como escolher?",
      "A descoberta aqui no site ajuda a organizar suas preferências. Você também pode conversar diretamente com a equipe, contando os perfumes de que gosta e a ocasião de uso.",
    ],
  ];
  return (
    <div className="faq">
      {items.map(([q, a], i) => (
        <div className="faq-item" key={q}>
          <h3>
            <button
              aria-expanded={active === i}
              aria-controls={`faq-${i}`}
              onClick={() => setActive(active === i ? null : i)}
            >
              {q}
              {active === i ? <Minus size={18} /> : <Plus size={18} />}
            </button>
          </h3>
          <div id={`faq-${i}`} hidden={active !== i}>
            <p>{a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
