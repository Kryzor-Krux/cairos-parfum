"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowUpRight, X, Plus, Minus, Sparkles, Leaf } from "lucide-react";
import { contacts } from "@/data/perfumes";
import { defaultMessage, whatsappUrl } from "@/lib/contact";

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
      "Na coleção, escolha uma fragrância e toque em “Quero conhecer”. Depois, escolha seu atendente para abrir o WhatsApp com o nome do perfume. Nossa equipe informa valor e disponibilidade na conversa.",
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
