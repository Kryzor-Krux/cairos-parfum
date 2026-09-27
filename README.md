# Cairo’s Parfum — O invisível deixa marca

Experiência de marca em Next.js, React e TypeScript. A direção de arte combina seda bordô, luz âmbar, fotografia de campanha e tipografia editorial. A descoberta acontece em uma galeria interativa de fragrâncias, uma narrativa de notas guiada pela rolagem e um atelier pessoal em três escolhas.

- Site: https://cairos-parfum.vercel.app
- Código: https://github.com/Kryzor-Krux/cairos-parfum — repositório privado.

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

## Experiência e interações

A abertura apresenta uma composição de campanha com movimento de profundidade. O menu em tela cheia dá acesso aos capítulos; a barra superior acompanha o progresso de leitura e os atalhos mobile mantêm seleção, descoberta e contato acessíveis.

A galeria permite trocar entre quatro perfumes por arraste, setas, teclado e seleção direta. Cada fragrância tem atmosfera própria, fotografia oficial, detalhes e notas divididas em abertura, coração e fundo. A consulta leva o nome do perfume para o atendimento.

A narrativa do Khamrah Qahwa revela três capítulos durante a rolagem. As notas são interativas: um toque revela o papel de cada ingrediente na composição. Em telas de pouca altura e com movimento reduzido, os capítulos usam navegação manual e a seção deixa de prender a composição à janela.

O Atelier Cairo’s considera sensação, momento e presença. As três respostas alimentam uma recomendação editorial determinística entre os quatro perfumes da seleção. O resultado apresenta o perfume, notas, justificativa e as escolhas feitas. É possível ajustar as respostas, recomeçar e levar o resultado completo para uma conversa. Os pesos são afinidades com os perfis de notas, sem pontuação de desempenho ou promessa de adequação universal.

Os componentes respeitam a preferência de movimento reduzido. O atendimento usa um diálogo nativo com retorno de foco e fechamento por Escape. Nenhuma mensagem é enviada automaticamente: o visitante escolhe Cássio ou Medeiros e confirma o envio no WhatsApp.

## Conteúdo e manutenção

- `src/app/page.tsx`: estrutura e conteúdo da experiência.
- `src/components/maison.tsx`: menu, campanha, introdução, narrativa sensorial e relatos.
- `src/components/perfume-gallery.tsx`: galeria, gestos e exploração das notas.
- `src/components/scent-atelier.tsx`: escolhas, progresso e resultado do atelier.
- `src/components/experience.tsx`: atendimento, diálogo, atalhos mobile e perguntas frequentes.
- `src/lib/atelier.ts`: perfis, pesos editoriais, recomendação e mensagem do resultado.
- `src/lib/contact.ts`: mensagens e geração dos links de WhatsApp.
- `src/data/perfumes.ts`: produtos, notas, fontes, contatos e relatos.
- `src/app/globals.css`: fundamentos de estilo e elementos compartilhados.
- `src/app/maison.css`, `gallery.css` e `atelier.css`: direção de arte e adaptações de cada experiência.
- `public/images/`: imagens locais otimizadas em WebP.

Não há carrinho, pagamento, formulário de coleta, analytics ou banco de dados. As escolhas do atelier ficam apenas no estado da página.

## Fontes e decisões editoriais

As notas e fotografias oficiais dos quatro perfumes vêm das páginas dos fabricantes vinculadas em `src/data/perfumes.ts`. Famílias resumidas, sensações, descrições e afinidades do atelier são redação editorial. Consulte disponibilidade e valores no atendimento; preços e estoque não são simulados.

Os contatos de Cássio e Medeiros foram obtidos no link público da marca (`https://linkme.bio/cairos?utm_source=instagram`). A entrega em Taubaté e região foi informada no perfil público da Cairo’s, com orientação para confirmar a cobertura do endereço.

Os três relatos são trechos do PDF fornecido: páginas 16 (So Candid), 15 (Club de Nuit) e 19 (Fakhar Black). Os dois últimos unem mensagens da mesma conversa com pontuação de leitura. Não publicamos nomes, avatares ou capturas de conversas. Não são garantia de desempenho universal.

Veja `ASSETS.md` para a procedência das fotos oficiais, fontes e demais arquivos. `CAMPAIGN-ASSETS.md` documenta as duas imagens de campanha geradas com IA, suas referências, prompts e otimização. A imagem de campanha do Qahwa é uma interpretação visual; a galeria e o resultado usam a fotografia oficial do frasco.

## Publicação e manutenção editorial

O projeto está conectado à Vercel pelo repositório privado do GitHub. Configure um domínio personalizado com `NEXT_PUBLIC_SITE_URL` (ver `.env.example`); na Vercel, o domínio de produção também é detectado por `VERCEL_PROJECT_PRODUCTION_URL`.

Mantenha seleção comercial, contatos e cobertura de entrega atualizados com a marca. A assinatura tipográfica e o ícone podem ser substituídos pelos arquivos oficiais quando disponíveis. Produtos, fontes e perfis estão separados da interface para permitir futuras atualizações de catálogo ou integração com CMS.
