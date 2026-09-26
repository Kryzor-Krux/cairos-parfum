export type Perfume = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  volume: number;
  concentration: string;
  image: string;
  tone: string;
  family: string;
  feeling: string;
  description: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  source: string;
  availability: "unknown" | "in_stock" | "out_of_stock" | "on_request";
};
export const perfumes: Perfume[] = [
  {
    id: "qahwa",
    slug: "khamrah-qahwa",
    name: "Khamrah Qahwa",
    brand: "Lattafa",
    volume: 100,
    concentration: "Eau de parfum",
    image: "/images/qahwa.webp",
    tone: "amber",
    family: "Especiado · Gourmand",
    feeling: "Calor que envolve.",
    description:
      "A energia das especiarias encontra a doçura do pralinê. No fundo, café arábica e baunilha dão profundidade a uma composição acolhedora e cheia de personalidade.",
    notes: {
      top: ["Gengibre", "Canela", "Cardamomo"],
      heart: ["Pralinê", "Frutas cristalizadas", "Flores brancas"],
      base: ["Café arábica", "Fava tonka", "Musk", "Benjoim", "Baunilha"],
    },
    source: "https://lattafa.com/product/khamrah-qahwa/",
    availability: "unknown",
  },
  {
    id: "pisa",
    slug: "pisa",
    name: "Pisa",
    brand: "Lattafa Pride",
    volume: 100,
    concentration: "Eau de parfum",
    image: "/images/pisa.webp",
    tone: "sage",
    family: "Cítrico · Amadeirado",
    feeling: "Frescor com personalidade.",
    description:
      "Bergamota, mandarina e limão abrem caminho para o cedro. Sândalo e âmbar completam uma composição que une luminosidade e profundidade.",
    notes: {
      top: ["Bergamota", "Mandarina", "Limão"],
      heart: ["Cedro"],
      base: ["Sândalo", "Âmbar"],
    },
    source: "https://lattafa.com/product/pisa/",
    availability: "unknown",
  },
  {
    id: "sabah",
    slug: "sabah-al-ward",
    name: "Sabah Al Ward",
    brand: "Al Wataniah",
    volume: 100,
    concentration: "Eau de parfum",
    image: "/images/sabah.webp",
    tone: "rose",
    family: "Floral · Gourmand",
    feeling: "Delicadeza que marca.",
    description:
      "Mandarina e pimenta rosa encontram um coração de cacau, flor de laranjeira e jasmim sambac. Baunilha, fava tonka e patchouli envolvem a composição.",
    notes: {
      top: ["Mandarina", "Pimenta rosa"],
      heart: ["Cacau", "Flor de laranjeira", "Jasmim sambac"],
      base: ["Baunilha", "Fava tonka", "Patchouli"],
    },
    source: "https://www.alwataniah.com/products/sabah-al-ward",
    availability: "unknown",
  },
  {
    id: "qaed",
    slug: "qaed-al-fursan",
    name: "Qaed Al Fursan",
    brand: "Lattafa",
    volume: 90,
    concentration: "Eau de parfum",
    image: "/images/qaed.webp",
    tone: "olive",
    family: "Frutado · Amadeirado",
    feeling: "Uma presença singular.",
    description:
      "O encontro luminoso do abacaxi com o açafrão se desenvolve em jasmim e bálsamo de abeto. Oud, cedro e âmbar compõem o fundo amadeirado.",
    notes: {
      top: ["Açafrão", "Abacaxi"],
      heart: ["Jasmim", "Bálsamo de abeto"],
      base: ["Oud", "Cedro", "Âmbar"],
    },
    source: "https://lattafa.com/product/qaed-al-fursan/",
    availability: "unknown",
  },
];
export const testimonials = [
  {
    quote: "“Simmmmm, muito bom!!! Fixa demais.”",
    product: "So Candid",
    context: "Relato enviado por WhatsApp",
    page: 16,
  },
  {
    quote: "“Top demais o perfume. Entregou oq prometeu.”",
    product: "Club de Nuit",
    context: "Trechos de uma conversa com cliente",
    page: 15,
  },
  {
    quote: "“O perfume é bom, fixou bem. Rende elogio.”",
    product: "Fakhar Black",
    context: "Trechos de uma conversa com cliente",
    page: 19,
  },
];
export const contacts = [
  { name: "Cássio", phone: "5512996202401" },
  { name: "Medeiros", phone: "5512988340114" },
];
