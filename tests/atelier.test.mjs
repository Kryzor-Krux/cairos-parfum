import { test } from "node:test";
import assert from "node:assert/strict";
import { recommendScent, atelierMessage, atelierLabels } from "../src/lib/atelier.ts";
import { perfumes } from "../src/data/perfumes.ts";
import { whatsappUrl } from "../src/lib/contact.ts";

test("a indicação cobre toda a seleção com afinidades olfativas distintas", () => {
  assert.equal(recommendScent({ feeling: "fresco", occasion: "cotidiano", presence: "leve" }), "pisa");
  assert.equal(recommendScent({ feeling: "envolvente", occasion: "noite", presence: "memoravel" }), "qahwa");
  assert.equal(recommendScent({ feeling: "floral", occasion: "encontro", presence: "proxima" }), "sabah");
  assert.equal(recommendScent({ feeling: "marcante", occasion: "noite", presence: "memoravel" }), "qaed");
});

test("a ocasião e a presença influenciam a recomendação", () => {
  assert.equal(recommendScent({ feeling: "envolvente", occasion: "encontro", presence: "proxima" }), "sabah");
  assert.equal(recommendScent({ feeling: "envolvente", occasion: "encontro", presence: "memoravel" }), "qahwa");
  assert.equal(recommendScent({ feeling: "marcante", occasion: "encontro", presence: "leve" }), "qahwa");
  assert.equal(recommendScent({ feeling: "marcante", occasion: "cotidiano", presence: "leve" }), "qaed");
});

test("todas as combinações geram um perfume real, sem resultado vazio", () => {
  for (const feeling of Object.keys(atelierLabels.feeling)) {
    for (const occasion of Object.keys(atelierLabels.occasion)) {
      for (const presence of Object.keys(atelierLabels.presence)) {
        assert.ok(perfumes.some((perfume) => perfume.id === recommendScent({ feeling, occasion, presence })));
      }
    }
  }
});

test("a mensagem preserva as três escolhas e consulta disponibilidade", () => {
  const profile = { feeling: "floral", occasion: "encontro", presence: "proxima" };
  const message = atelierMessage(profile, "Sabah Al Ward");
  assert.ok(message.includes(atelierLabels.feeling[profile.feeling]));
  assert.ok(message.includes(atelierLabels.occasion[profile.occasion]));
  assert.ok(message.includes(atelierLabels.presence[profile.presence]));
  assert.match(message, /Sabah Al Ward/);
  assert.match(message, /consultar valor e disponibilidade/);
  assert.equal(new URL(whatsappUrl("5512996202401", message)).searchParams.get("text"), message);
});
