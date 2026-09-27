export type ScentFeeling = "fresco" | "envolvente" | "floral" | "marcante";
export type ScentOccasion = "cotidiano" | "encontro" | "noite";
export type ScentPresence = "leve" | "proxima" | "memoravel";
export type ScentProfile = {
  feeling: ScentFeeling;
  occasion: ScentOccasion;
  presence: ScentPresence;
};
export type ScentRecommendation = "pisa" | "qahwa" | "sabah" | "qaed";

export const atelierLabels = {
  feeling: {
    fresco: "Frescor & liberdade",
    envolvente: "Calor & aconchego",
    floral: "Flores & delicadeza",
    marcante: "Mistério & presença",
  },
  occasion: {
    cotidiano: "No meu cotidiano",
    encontro: "Em um encontro",
    noite: "Quando a noite começa",
  },
  presence: {
    leve: "Uma sensação de leveza",
    proxima: "Algo que convida a chegar perto",
    memoravel: "Uma assinatura com personalidade",
  },
} as const;

// Editorial affinities between preferences and the published note profiles.
// These weights select a starting point; they are never a performance score.
const feelingAffinities: Record<ScentFeeling, Record<ScentRecommendation, number>> = {
  fresco: { pisa: 6, qahwa: 0, sabah: 0, qaed: 2 },
  envolvente: { pisa: 0, qahwa: 6, sabah: 4, qaed: 1 },
  floral: { pisa: 0, qahwa: 1, sabah: 8, qaed: 1 },
  marcante: { pisa: 1, qahwa: 5, sabah: 2, qaed: 6 },
};
const occasionAffinities: Record<ScentOccasion, Record<ScentRecommendation, number>> = {
  cotidiano: { pisa: 2, qahwa: 0, sabah: 1, qaed: 1 },
  encontro: { pisa: 0, qahwa: 2, sabah: 2, qaed: 0 },
  noite: { pisa: 0, qahwa: 2, sabah: 1, qaed: 1 },
};
const presenceAffinities: Record<ScentPresence, Record<ScentRecommendation, number>> = {
  leve: { pisa: 3, qahwa: 0, sabah: 1, qaed: 0 },
  proxima: { pisa: 0, qahwa: 1, sabah: 4, qaed: 0 },
  memoravel: { pisa: 0, qahwa: 2, sabah: 0, qaed: 3 },
};

export function recommendScent(profile: ScentProfile): ScentRecommendation {
  const order: ScentRecommendation[] = ["pisa", "qahwa", "sabah", "qaed"];
  return order.reduce((best, candidate) => {
    const affinity = (id: ScentRecommendation) =>
      feelingAffinities[profile.feeling][id] +
      occasionAffinities[profile.occasion][id] +
      presenceAffinities[profile.presence][id];
    return affinity(candidate) > affinity(best) ? candidate : best;
  });
}

export const atelierRationale: Record<ScentRecommendation, string> = {
  pisa: "Bergamota, mandarina e limão traduzem essa vontade de leveza. Cedro e sândalo acrescentam uma camada amadeirada à abertura luminosa.",
  qahwa: "Canela e cardamomo abrem uma composição calorosa. Pralinê, café arábica e baunilha trazem a textura doce e envolvente que imaginamos para você.",
  sabah: "Jasmim sambac e flor de laranjeira encontram cacau e baunilha. Um caminho floral com doçura e uma textura que conversa com a sua escolha.",
  qaed: "Abacaxi e açafrão criam um começo inesperado. Oud, cedro e âmbar aprofundam essa combinação frutada e amadeirada, cheia de personalidade.",
};

export function atelierMessage(profile: ScentProfile, perfumeName: string): string {
  return `Olá! Fiz o Atelier da Cairo’s Parfum. Minhas escolhas foram: sensação — ${atelierLabels.feeling[profile.feeling]}; ocasião — ${atelierLabels.occasion[profile.occasion]}; presença — ${atelierLabels.presence[profile.presence]}. A sugestão foi ${perfumeName}. Gostaria de conhecer melhor e consultar valor e disponibilidade.`;
}
