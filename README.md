# Cairo’s Parfum — O invisível deixa marca

Campanha digital interativa em Next.js, React e TypeScript. A versão V4 apresenta fragrâncias por meio de fotografia, luz, narrativa guiada pelo scroll e uma consultoria olfativa em três escolhas. O objetivo continua sendo descobrir um perfume e iniciar uma conversa pelo WhatsApp.

- [Endereço de produção](https://cairos-parfum.vercel.app/)
- [Repositório privado](https://github.com/Kryzor-Krux/cairos-parfum)
- [Verificações da revisão atual](QUALITY-REPORT.md)

Não há carrinho, checkout, login, pedidos, banco de dados ou painel administrativo. Produtos, recomendações e mensagens estão separados da interface para permitir evolução posterior sem introduzir essas funções agora.

## Executar e verificar

Use Node.js 22.x. O lockfile fixa as versões instaladas; `npm ci` reproduz as dependências.

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`. Para verificar e executar a versão de produção:

```bash
npm run typecheck
npm test
npm run build
npm start
```

Os testes em Node cobrem mensagens de WhatsApp, recomendações do Atelier, navegação de cenas e funções de carregamento de sequências. A validação visual e as medições em navegador são etapas separadas, registradas em `QUALITY-REPORT.md`.

## Experiência V4

O hero parte da campanha em seda bordô e luz âmbar. Texto recortado, névoa e uma mudança de iluminação conduzem ao frasco oficial. Em janelas com pelo menos 760 px de altura e sem preferência de movimento reduzido, GSAP acrescenta pin e scrub. A progressão extra usa aproximadamente 1,25 altura de janela abaixo de 768 px de largura e 1,6 nas demais larguras. Em janelas baixas, a abertura permanece no fluxo normal.

A coleção mantém quatro perfumes reais. Mobile e tablet usam rolagem horizontal nativa com scroll snap e parte do próximo card visível. Em desktop com ponteiro fino, largura mínima de 1024 px, altura mínima de 740 px e movimento permitido, a rolagem vertical conduz os quatro painéis horizontalmente. Índice, setas, teclado e link para pular a seleção oferecem caminhos diretos. Com movimento reduzido, os quatro artigos aparecem em sequência estática. As notas usam `details` nativo e abas com navegação por teclado.

A história do Khamrah Qahwa acompanha abertura, coração e fundo conforme as notas do fabricante. Em janelas com pelo menos 820 px de altura e movimento permitido, o scroll sincroniza produto, luz e capítulos. Nas demais, os capítulos são escolhidos pelos botões. As descrições sensoriais são editoriais; os ingredientes permanecem ligados à fonte de dados dos produtos.

O Atelier considera sensação, momento e presença. A recomendação é determinística, baseada em afinidades editoriais, e sempre aponta para um dos quatro perfumes existentes. O visitante pode voltar, ajustar escolhas ou recomeçar. O resultado leva o nome do perfume e as três respostas para uma mensagem de consulta.

Menu e atendimento usam diálogos nativos, fechamento por Escape, bloqueio de scroll e retorno de foco. Ao escolher Cássio ou Medeiros, o site abre o WhatsApp com a mensagem preparada. O visitante revisa e envia; a aplicação não envia mensagens automaticamente.

## Arquitetura e manutenção

| Arquivo ou diretório | Responsabilidade |
| --- | --- |
| `src/app/page.tsx` | Ordem dos capítulos e composição da página. |
| `src/app/layout.tsx` | Fontes, metadata, Open Graph, JSON-LD da organização e runtime de movimento. |
| `src/components/hero/cinematic-hero.tsx` | Abertura e transição cinematográfica. |
| `src/components/layout/` | Menu, introdução da marca e rodapé. |
| `src/components/perfume-gallery.tsx` | Coleção, scroll horizontal, notas e consultas por produto. |
| `src/components/storytelling/qahwa-story.tsx` | Narrativa olfativa e sincronização da cena. |
| `src/components/storytelling/image-sequence.tsx` | Canvas opcional, carregamento progressivo e imagem alternativa. |
| `src/components/scent-atelier.tsx` | Escolhas, transições e ficha de recomendação. |
| `src/components/testimonials/voices.tsx` | Relatos existentes; aceita capturas de conversa opcionais. |
| `src/components/contact/final-contact.tsx` | Fechamento da campanha, entrega e perguntas frequentes. |
| `src/components/experience.tsx` | Contexto de atendimento, diálogo, atalhos mobile e FAQ. |
| `src/components/motion/` | Runtime Lenis, texto dividido e revelações reutilizáveis. |
| `src/lib/motion/` | GSAP compartilhado, easing, navegação, sinais do dispositivo e orçamento de sequências. |
| `src/lib/atelier.ts`, `src/lib/contact.ts` | Recomendação, justificativas e mensagens. |
| `src/data/perfumes.ts`, `src/data/scent-story.ts` | Produtos, notas, contatos, relatos e capítulos sensoriais. |
| `src/lib/analytics.ts`, `src/components/analytics-runtime.tsx` | Eventos locais da experiência. |
| `src/lib/site.ts`, `src/app/robots.ts`, `src/app/sitemap.ts` | URL canônica, dados do site e descoberta por buscadores. |

`globals.css` contém fundamentos compartilhados; `maison.css` mantém layout, navegação e identidade editorial. `cinema.css`, `gallery.css`, `storytelling.css`, `atelier.css` e `voices.css` tratam suas respectivas cenas. Os antigos componentes agregados `maison.tsx` e `immersive.tsx`, além de `immersive.css`, foram substituídos pela estrutura acima.

### Movimento

GSAP controla timelines, pin, scrub e transformações das cenas. Motion controla estados de interface, menu, Atelier, abas e microinterações. Não atribua a mesma propriedade do mesmo elemento às duas bibliotecas.

Lenis só é carregado em desktop a partir de 1024 px com ponteiro fino, sem movimento reduzido, economia de dados ou conexão 2G/3G informada. Touch mantém scroll nativo. O ticker do GSAP alimenta Lenis e os eventos de scroll atualizam ScrollTrigger. Modais suspendem essa suavização; áreas com `data-native-scroll` preservam rolagem própria. Botões de capítulos devem usar `scrollSceneTo()` para não disputar com Lenis.

A implementação limpa timelines, media queries, observers, eventos e callbacks ao desmontar. Veja [a documentação do runtime](src/lib/motion/README.md) para contratos de integração e primitives de reveal.

### Sequência de imagens: preparada, ainda sem frames

A cena atual usa a fotografia oficial do Qahwa com transformações e iluminação. Não existe uma rotação fotografada ou renderizada em sequência neste repositório. O componente `ImageSequence` está integrado sem manifest, portanto não solicita frames inexistentes nem oculta a fotografia alternativa.

Para material futuro, adicione frames reais em `public/sequences/qahwa/desktop/` e `public/sequences/qahwa/mobile/`, depois forneça um manifest. O sistema tem preload progressivo, cache limitado, variantes por largura, cancelamento de downloads e fallback para movimento reduzido, economia de dados, redes lentas e memória limitada. O procedimento completo está em [public/sequences/qahwa/README.md](public/sequences/qahwa/README.md). Nenhuma biblioteca WebGL ou Lottie faz parte da aplicação.

### Eventos e privacidade

`trackEvent()` dispara um `CustomEvent` chamado `cairos:analytics`, com `detail: { name, properties }`. Os eventos disponíveis são `hero_view`, `collection_view`, `perfume_view`, `perfume_cta_click`, `atelier_start`, `atelier_step`, `atelier_complete`, `whatsapp_click` e `instagram_click`.

As propriedades permitidas são `perfume_id`, `source`, `step` e `choice`. O helper filtra os valores; não inclui telefone, texto da mensagem ou identificador do visitante. Não há SDK de analytics, envio desses eventos a um servidor, cookies ou persistência das escolhas implementados pela aplicação. O ponto de integração permite acrescentar um provedor posteriormente; isso requer uma decisão própria de coleta e privacidade. As escolhas do Atelier ficam apenas no estado da página.

## Conteúdo, imagens e fontes

As notas e fotografias dos quatro perfumes vêm das páginas de fabricantes vinculadas em `src/data/perfumes.ts`. Famílias resumidas, sensações, descrições e afinidades do Atelier são redação editorial. A disponibilidade permanece `unknown`: preços, estoque, prazo, garantia e condições de pagamento não são simulados.

Os contatos de Cássio e Medeiros vieram do [link público da marca](https://linkme.bio/cairos?utm_source=instagram). A entrega em Taubaté e região foi informada no perfil público da Cairo’s; o site pede confirmação da cobertura do endereço. Essas informações devem ser reconfirmadas com a marca quando houver mudanças comerciais.

Os três relatos foram extraídos do PDF fornecido: páginas 16 (So Candid), 15 (Club de Nuit) e 19 (Fakhar Black). Os dois últimos combinam mensagens da mesma conversa com pontuação de leitura. Não são publicados nomes, avatares, datas inventadas ou screenshots nesta versão. O componente aceita capturas futuras, com dados pessoais revisados antes de publicação. Relatos individuais não são promessa de desempenho universal.

Fotografias de produto e fundos usam `next/image`. A campanha do hero é uma interpretação visual gerada com IA a partir da referência do Qahwa; a galeria, o Atelier e o fallback da história usam a fotografia oficial. O preload explícito é reservado à imagem principal do hero, servida como WebP já otimizado para evitar transformação no primeiro acesso. Cormorant Garamond 400 e Manrope 400/600 são servidas localmente em WOFF2 por `next/font/local`, com `display: swap`; os TTF e licenças foram preservados.

- [ASSETS.md](ASSETS.md): procedência e uso atual de imagens e fontes.
- [CAMPAIGN-ASSETS.md](CAMPAIGN-ASSETS.md): prompts, referências e arquivos de campanha.
- [FONT-ASSETS.md](FONT-ASSETS.md): conversão WOFF2, tamanhos e verificações das fontes.

## Publicação

O destino do projeto é a Vercel, ligado ao repositório privado no GitHub. A URL base é centralizada em `src/lib/site.ts`: usa `NEXT_PUBLIC_SITE_URL` quando definida e, caso contrário, `https://cairos-parfum.vercel.app`. Ao configurar um domínio próprio, atualize essa variável para a URL pública completa. O valor `localhost` do `.env.example` destina-se apenas ao desenvolvimento.

Metadata, canonical, sitemap, robots e JSON-LD usam essa URL. A revisão V4 só deve ser considerada publicada após confirmar o deploy e verificar a URL de produção; as verificações técnicas estão em `QUALITY-REPORT.md` e o registro final de commit/deployment acompanha a entrega em `../Cairos_Parfum_Entrega.md`.
