export function productMessage(name: string) {
  return `Olá! Vi o ${name} no site da Cairo’s Parfum. Poderiam me informar disponibilidade e valor?`;
}
export const defaultMessage =
  "Olá! Vim pelo site da Cairo’s Parfum e gostaria de ajuda para escolher um perfume.";
export function discoveryMessage(preference: string, occasion: string) {
  const taste =
    preference === "Ainda não sei"
      ? "Ainda não sei qual perfil de perfume escolher"
      : `Meu interesse é um perfume ${preference.toLowerCase()}`;
  return `Olá! Fiz a descoberta no site da Cairo’s Parfum. ${taste} e procuro algo para ${occasion.toLowerCase()}. Quais opções vocês recomendam?`;
}
export function whatsappUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  if (!/^\d{10,15}$/.test(digits))
    throw new Error("Número de atendimento inválido");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
