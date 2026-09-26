# Cairo’s Parfum — Presença que fica

Landing page funcional em Next.js, React e TypeScript. Visual editorial em marfim e bronze, fotografias oficiais dos produtos, catálogo com painéis de notas, narrativa olfativa com rolagem, relatos, descoberta em duas perguntas e atendimento pelo WhatsApp.

## Executar

Requer Node.js 22.13 ou superior.

```bash
npm ci
npm run dev
```

Acesse http://localhost:3000. Para produção: `npm run build` e `npm start`.

## Verificação

```bash
npm run typecheck
npm test
npm run build
```

## Conteúdo e manutenção

- `src/data/perfumes.ts`: produtos, notas, fontes, contatos e relatos.
- `src/lib/contact.ts`: mensagens e geração dos links de WhatsApp.
- `src/components/experience.tsx`: menu, painéis, descoberta e interações.
- `src/app/page.tsx`: conteúdo e estrutura da página.
- `src/app/globals.css`: identidade visual e adaptação às telas.
- `public/images/`: imagens locais otimizadas em WebP.

O questionário organiza preferências e as leva para uma conversa; não simula uma recomendação automatizada. Não há carrinho, pagamento, formulário de coleta, analytics ou banco de dados. Nenhuma mensagem é enviada automaticamente: o visitante escolhe o atendente e confirma o envio no WhatsApp.

## Fontes e decisões editoriais

As notas e fotografias dos quatro perfumes vêm das páginas dos fabricantes vinculadas nas fichas. As famílias resumidas, sensações e descrições são redação editorial. Disponibilidade está explicitamente desconhecida, sem preços ou estoque inventados.

Os contatos de Cássio e Medeiros foram obtidos no link público da marca (`https://linkme.bio/cairos?utm_source=instagram`). A entrega em Taubaté e região foi informada no perfil público da Cairo’s, com orientação para confirmar a cobertura do endereço.

Os três relatos são trechos do PDF fornecido: páginas 16 (So Candid), 15 (Club de Nuit) e 19 (Fakhar Black). Os dois últimos unem mensagens da mesma conversa com pontuação de leitura. Não publicamos nomes, avatares ou capturas de conversas. Não são garantia de desempenho universal.

## Publicação e manutenção editorial

Validar a seleção comercial, contatos e entrega com a marca; confirmar a autorização para reutilização dos depoimentos e fotos; substituir a assinatura tipográfica e o ícone provisórios pelos arquivos oficiais se disponíveis. Configurar o domínio na variável `NEXT_PUBLIC_SITE_URL` (ver `.env.example`). Na Vercel, o domínio de produção também é detectado pela variável de sistema `VERCEL_PROJECT_PRODUCTION_URL`.

## Evolução

Os produtos estão separados da interface e já têm IDs, slugs e estados de disponibilidade. Um futuro CMS ou catálogo pode substituir esse módulo. Estoque, checkout e pagamentos exigem uma integração própria; não são simulados nesta versão.

Veja `ASSETS.md` para a procedência dos arquivos visuais.

## Experiência mobile

Carrossel de perfumes com scroll nativo, encaixe central, botões de navegação, teclado e indicador de posição. Scrollytelling de três cenas controla posição do frasco, tipografia e atmosfera sem capturar a rolagem da página. Há atalhos entre cenas e para pular a experiência. A preferência de movimento reduzido troca a sequência por conteúdo estático, com todos os capítulos visíveis. Depoimentos também podem ser arrastados no celular, e a navegação inferior mantém seleção, descoberta e contato ao alcance do polegar.

`src/components/immersive.tsx` contém a narrativa; `src/app/immersive.css` concentra a nova direção mobile.
