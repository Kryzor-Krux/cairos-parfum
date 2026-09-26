import { test } from "node:test";
import assert from "node:assert/strict";
import {
  whatsappUrl,
  productMessage,
  discoveryMessage,
} from "../src/lib/contact.ts";

test("o WhatsApp preserva acentos, apóstrofos e o nome do perfume na mensagem", () => {
  const message = productMessage("Qahwa & café");
  const url = new URL(whatsappUrl("+55 (12) 99620-2401", message));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/5512996202401");
  assert.equal(url.searchParams.get("text"), message);
  assert.equal([...url.searchParams.keys()].length, 1);
});

test("as duas respostas acompanham o pedido de sugestões", () => {
  const message = discoveryMessage("Floral", "Presente");
  assert.match(message, /perfume floral/);
  assert.match(message, /para presente/);
  assert.doesNotMatch(message, /undefined/);
});

test("quem ainda não sabe pode pedir orientação sem recomendação inventada", () => {
  assert.match(
    discoveryMessage("Ainda não sei", "Dia a dia"),
    /Ainda não sei qual perfil/,
  );
});

test("não cria links de atendimento com telefone incompleto", () => {
  assert.throws(() => whatsappUrl("123", "Olá"), /inválido/);
});
