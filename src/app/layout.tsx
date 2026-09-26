import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./immersive.css";
const editorial = localFont({
  src: "../../public/fonts/cormorant-garamond-400.ttf",
  variable: "--font-editorial",
  display: "swap",
});
const sans = localFont({
  src: [
    { path: "../../public/fonts/manrope-400.ttf", weight: "400" },
    { path: "../../public/fonts/manrope-600.ttf", weight: "600" },
  ],
  variable: "--font-sans",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  ),
  title: "Cairo’s Parfum — Presença que fica",
  description:
    "Perfumes importados para encontrar o seu jeito de marcar um momento. Conheça nossa seleção e converse pelo WhatsApp. Taubaté e região.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Cairo’s Parfum — Presença que fica",
    description: "Sua próxima escolha começa com uma conversa.",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/images/atmosphere.webp", width: 1536, height: 1024 }],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${editorial.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
