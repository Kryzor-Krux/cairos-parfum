import { perfumes } from './perfumes';

const qahwa = perfumes.find(perfume => perfume.id === 'qahwa')!;
export const scentChapters = [
  { label: 'Abertura', word: 'Desperta.', title: 'Tudo começa com uma faísca.', description: 'Gengibre, canela e cardamomo. O frescor encontra o calor e dá o primeiro sinal de uma presença.', notes: qahwa.notes.top },
  { label: 'Coração', word: 'Envolve.', title: 'A proximidade muda tudo.', description: 'Pralinê, frutas cristalizadas e flores brancas. A composição ganha corpo, textura e novas camadas.', notes: qahwa.notes.heart },
  { label: 'Fundo', word: 'Permanece.', title: 'Você vai. A lembrança fica.', description: 'Café arábica, fava tonka, musk, benjoim e baunilha. Um fundo profundo, quente e acolhedor.', notes: qahwa.notes.base },
] as const;

export const noteDescriptions: Record<string, string> = {
  Gengibre: 'Uma faceta fresca e picante. A energia do primeiro encontro.',
  Canela: 'Quente e especiada. Uma sensação que envolve desde a abertura.',
  Cardamomo: 'Aromático e levemente fresco. Contraste para o calor das especiarias.',
  Pralinê: 'Açúcar e castanhas em uma nota gourmand. Doçura com textura.',
  'Frutas cristalizadas': 'Uma faceta frutada e doce que acompanha o coração da fragrância.',
  'Flores brancas': 'Um lado floral ilumina a composição e encontra a doçura do pralinê.',
  'Café arábica': 'Torrado e aromático. A nuance que dá personalidade ao fundo do Qahwa.',
  'Fava tonka': 'Uma faceta amendoada e quente, com nuances que lembram baunilha.',
  Musk: 'Uma textura macia que ajuda a unir as notas do fundo.',
  Benjoim: 'Resinoso, balsâmico e levemente doce. Uma sensação acolhedora.',
  Baunilha: 'Doçura macia e envolvente. Um encontro entre calor e aconchego.',
};
