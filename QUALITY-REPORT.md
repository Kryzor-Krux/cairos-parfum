# Verificação da revisão V4 — Cairo’s Parfum

Verificação executada em 30/09/2026 sobre a revisão V4 integrada. Os resultados distinguem testes automatizados, inspeção de código, revisão visual e medição local. A confirmação do deployment correspondente acompanha a entrega em `../Cairos_Parfum_Entrega.md`.

## Ambiente e comandos executados

Ambiente desta verificação: Node.js `v22.23.3`, npm `10.9.9`. Versões registradas no lockfile: Next.js `16.3.6`, React `19.3.0`, Motion `12.43.0`, GSAP `3.15.0`, Lenis `1.3.26` e TypeScript `5.9.3`.

| Verificação | Resultado registrado | Limite da evidência |
| --- | --- | --- |
| `npm run typecheck` | Passou em 30/09/2026; código de saída 0. | Valida tipagem da árvore local naquele momento, sem interação de navegador. |
| `npm test` | Passou em 30/09/2026; 16 testes em 4 arquivos, 0 falhas. | Testes de funções e contratos; não são testes de ponta a ponta da interface. |
| `npm run build` | Passou; código de saída 0, 6/6 páginas estáticas geradas. | Build final integrado, incluindo o WebP direto no hero e navegação compartilhada no Atelier. |
| Verificação visual em navegador | Concluída nas sete larguras solicitadas e também em 320 px. | Emulação de viewport no Chromium do navegador integrado; não equivale a aparelho físico. |
| Performance em build de produção | LCP local de 904 ms em uma execução; detalhes abaixo. | Sem throttling e sem garantia de cache frio. INP/CLS e Lighthouse não foram obtidos. |
| Publicação | Registro separado na entrega. | Commit, deployment, estado e smoke test público constam em `../Cairos_Parfum_Entrega.md`, gerado após o deploy. |

### Cobertura dos testes presentes

- `tests/contact.test.mjs`: normalização do telefone, preservação de acentos e mensagem na URL, consultas de descoberta e rejeição de telefone incompleto.
- `tests/atelier.test.mjs`: indicações para os quatro produtos, influência das escolhas, resultado válido em todas as combinações e mensagem com as três respostas.
- `tests/scroll.test.mjs`: seleção de Lenis ou scroll nativo, movimento reduzido, limpeza de registros antigos e offsets de anchors sem duplicação do espaço do header.
- `tests/sequence.test.mjs`: limites de índice, URLs do manifest, variante mobile, preload limitado, frame mais próximo e fallback conforme rede, memória e movimento reduzido.

## Fatos confirmados por inspeção do código

A página está dividida em hero, layout, coleção, história do Qahwa, Atelier, relatos e contato final. Os antigos componentes agregados `maison.tsx` e `immersive.tsx` e a folha `immersive.css` foram removidos. A classe de estilos `maison.css` permanece ativa para elementos compartilhados da identidade.

GSAP/ScrollTrigger controla as cenas. Motion continua nas interações de componente. O runtime compartilhado carrega Lenis somente em desktop com ponteiro fino e exclui movimento reduzido, economia de dados e rede lenta informada. Touch conserva scroll nativo. A coleção tem uma base nativa com scroll snap, incremento por pin em desktop elegível, navegação por teclado e link para sair da sequência. A história usa capítulos manuais quando não há altura ou preferência adequada para pin.

O sistema de canvas existe, mas não há frames de rotação em `public/sequences/qahwa/`. A história não passa manifest para `ImageSequence`; utiliza a fotografia oficial como fallback. Portanto, não há reprodução de sequência real nem requisições a frames ausentes na configuração atual. As funções de orçamento estão cobertas por testes; a fluidez de uma sequência futura precisará ser medida com o material real.

A galeria contém apenas Khamrah Qahwa, Pisa, Sabah Al Ward e Qaed Al Fursan. Abertura, coração e fundo do Qahwa reutilizam as notas de `src/data/perfumes.ts`. Todos os produtos mantêm disponibilidade `unknown`, sem preços fictícios. A interface consulta valor e disponibilidade no atendimento. Os três relatos preservam as referências ao PDF fornecido; não há nomes ou datas de clientes inventados.

`trackEvent()` publica somente um `CustomEvent` local, `cairos:analytics`. O helper restringe os campos a `perfume_id`, `source`, `step` e `choice`. A aplicação não implementa envio externo desses eventos, cookies de analytics ou persistência das respostas do Atelier. Há pontos de eventos para hero, coleção, perfume, Atelier, WhatsApp e Instagram.

O layout referencia três arquivos WOFF2 locais, somando 124.264 bytes, contra 480.304 bytes dos respectivos TTF preservados. Essa redução de 74,1% é de tamanho de arquivo, não de tempo de carregamento medido. Imagens usam `next/image`; a campanha do hero recebe preload explícito e serve o WebP de 217.120 bytes diretamente, sem transformação no primeiro acesso. Fontes e imagens estão documentadas em `ASSETS.md`, `FONT-ASSETS.md` e `CAMPAIGN-ASSETS.md`.

Metadata inclui canonical, Open Graph/Twitter e JSON-LD de organização; há rotas de robots e sitemap. A URL base vem de `NEXT_PUBLIC_SITE_URL`, com o domínio Cairo’s na Vercel como fallback. A presença desses arquivos não comprova indexação por buscadores.

## Matriz de navegador

Revisão em Chromium via navegador integrado. Todas as medidas são viewports CSS, sem emulação de hardware ou certificação de Safari/iOS/Android. O overflow foi medido após a atualização das cenas ao redimensionar.

| Viewport | Resultado observado |
| --- | --- |
| 320 × 740 | Verificação adicional: texto de abertura legível e zero overflow horizontal do documento. |
| 360 × 800 | Zero overflow horizontal após estabilização; composição mobile preservada. |
| 375 × 812 | Zero overflow horizontal; seções adaptadas à largura. |
| 390 × 844 | Hero com frasco inteiro, transição, galeria nativa, notas, história, Atelier e atendimento revisados. Zero overflow horizontal. |
| 430 × 932 | Fechamento e FAQ revisados; zero imagens quebradas e zero overflow horizontal. |
| 768 × 1024 | Galeria nativa e história em duas colunas revisadas visualmente; zero overflow horizontal. |
| 1024 × 900 | Galeria passa para cena horizontal; redimensionamento entre modos verificado. Zero overflow horizontal. |
| 1440 × 900 | Hero e galeria revisados visualmente; frascos inteiros e texto enquadrado. Zero overflow horizontal. |

Fluxos observados:

- Menu abre; Escape fecha, restaura foco e libera o scroll.
- Coleção mobile avança para Pisa por controle; índice e posição nativa acompanham a seleção. Notas expandem com conteúdo correto.
- Coleção desktop navega entre produtos, atualiza o índice e permite sair da sequência pelo link de salto.
- História alcança o terceiro capítulo; Café exibe a descrição correspondente. A cena mobile cabe em 844 px sem sobreposição com o dock.
- Atelier completa calor → noite → personalidade e recomenda Qahwa. O atendimento contém o produto e as três respostas, com consulta de disponibilidade.
- Os dois links `wa.me` contêm os contatos corretos e mensagem codificada. Nenhuma mensagem foi enviada.
- Atendimento fecha por Escape e restaura o foco no botão de origem.
- FAQ de entrega expande com a informação real de cobertura.
- Console do build final local: nenhum erro ou aviso capturado na verificação final.

Movimento reduzido, rede lenta/economia de dados, limpeza de callbacks e fallback foram revisados no código e, onde aplicável, nos testes de funções. Não houve emulação de preferência do sistema, desativação de JavaScript no navegador ou teste em aparelho físico. Conteúdo SSR e alternativas nativas foram inspecionados. Essas verificações não são apresentadas como testes de hardware.

## Performance medida

Build final executado com `npm start -- --port 3001`, URL `http://localhost:3001/`, Chromium integrado, viewport 390 × 844 definido antes do reload. Uma execução, sem limitação artificial de CPU/rede; cache potencialmente aquecido. Valores expostos pelo callback oficial `useReportWebVitals` do Next em `#cairos-performance`, consultado após interação com o menu. Não é um benchmark de produção nem dados de usuários reais.

| Métrica | Resultado |
| --- | --- |
| LCP | 904 ms (meta do briefing: até 2.500 ms). |
| FCP | 644 ms. |
| TTFB | 214,2 ms. |
| FID | 0,9 ms; não substitui INP. |
| INP | Não obtido: a instrumentação desta versão não finalizou o relatório durante a sessão visível. |
| CLS | Não obtido pelo mesmo motivo; não assumir zero. |
| Lighthouse / trabalho da thread principal | Não medidos. |
| Transferência inicial HTTP | Não medida; os tamanhos abaixo são de arquivos, não da sessão de rede. |

Orçamento dos artefatos finais: 11 arquivos JavaScript de produção totalizam 297.327 bytes gzip, incluindo chunks assíncronos; não correspondem ao JS inicial. CSS total: 15.909 bytes gzip. Três WOFF2: 124.264 bytes (redução de 74,1% frente aos TTF). Seis imagens utilizadas: 541.496 bytes antes das variantes do Next. O hero serve o WebP pronto para eliminar processamento de imagem no primeiro acesso.

A aplicação emite as métricas apenas localmente em `cairos:performance`, sem transmissão externa. Monitoramento real de Core Web Vitals exige uma decisão futura de coleta. A sequência real de rotação continua dependente de frames que não foram fornecidos; a versão entregue usa a fotografia oficial animada e não solicita arquivos ausentes.

## Publicação e rastreabilidade

O código e este relatório são versionados juntos. O registro externo `../Cairos_Parfum_Entrega.md` identifica o SHA publicado, deployment Vercel, estado confirmado e verificação no domínio [cairos-parfum.vercel.app](https://cairos-parfum.vercel.app/). O arquivo ZIP da entrega é exportado do mesmo commit, sem dependências instaladas, segredos ou diretório de build.
