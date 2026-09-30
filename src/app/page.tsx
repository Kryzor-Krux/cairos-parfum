import { ExperienceProvider, StickyContact } from '@/components/experience';
import { MaisonHeader } from '@/components/layout/maison-header';
import { MaisonFooter } from '@/components/layout/maison-footer';
import { BrandPrelude } from '@/components/layout/brand-prelude';
import { CinematicHero } from '@/components/hero/cinematic-hero';
import { PerfumeGallery } from '@/components/perfume-gallery';
import { QahwaStory } from '@/components/storytelling/qahwa-story';
import { ScentAtelier } from '@/components/scent-atelier';
import { Voices } from '@/components/testimonials/voices';
import { FinalContact } from '@/components/contact/final-contact';
import { AnalyticsRuntime } from '@/components/analytics-runtime';

export default function Home() {
  return <ExperienceProvider>
    <MaisonHeader/>
    <main id="conteudo">
      <CinematicHero/>
      <BrandPrelude/>
      <PerfumeGallery/>
      <QahwaStory/>
      <ScentAtelier/>
      <Voices/>
      <FinalContact/>
    </main>
    <MaisonFooter/>
    <StickyContact/>
    <AnalyticsRuntime/>
  </ExperienceProvider>;
}
