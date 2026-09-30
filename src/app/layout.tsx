import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { MotionRuntime } from '@/components/motion/motion-runtime';
import { WebVitals } from '@/components/web-vitals';
import { siteUrl, siteTitle, siteDescription } from '@/lib/site';
import './globals.css';
import './maison.css';
import './cinema.css';
import './gallery.css';
import './storytelling.css';
import './voices.css';

const editorial = localFont({ src: '../../public/fonts/cormorant-garamond-400.woff2', variable: '--font-editorial', display: 'swap' });
const sans = localFont({ src: [
  { path: '../../public/fonts/manrope-400.woff2', weight: '400' },
  { path: '../../public/fonts/manrope-600.woff2', weight: '600' },
], variable: '--font-sans', display: 'swap' });
const socialImage = { url: '/images/hero-campaign.webp', width: 1536, height: 1024, alt: 'Cairo’s Parfum — Khamrah Qahwa em luz âmbar' };

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#29151c' };
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), title: siteTitle, description: siteDescription,
  alternates: { canonical: '/' }, robots: { index: true, follow: true },
  openGraph: { title: siteTitle, description: siteDescription, url: '/', siteName: 'Cairo’s Parfum', locale: 'pt_BR', type: 'website', images: [socialImage] },
  twitter: { card: 'summary_large_image', title: siteTitle, description: siteDescription, images: ['/images/hero-campaign.webp'] },
};
const organization = {
  '@context': 'https://schema.org', '@type': 'Organization', name: 'Cairo’s Parfum', url: siteUrl,
  description: siteDescription, sameAs: ['https://www.instagram.com/cairosparfum/'],
  contactPoint: [
    { '@type': 'ContactPoint', telephone: '+55-12-99620-2401', contactType: 'sales', availableLanguage: 'Portuguese' },
    { '@type': 'ContactPoint', telephone: '+55-12-98834-0114', contactType: 'sales', availableLanguage: 'Portuguese' },
  ],
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR" className={`${editorial.variable} ${sans.variable}`}><body>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    {children}
    <MotionRuntime/>
    <WebVitals/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }}/>
  </body></html>;
}
