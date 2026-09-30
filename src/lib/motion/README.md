# Motion foundation

- `runtime.ts`: `loadGsap()` importa GSAP/ScrollTrigger uma única vez e registra o plugin. Use uma `gsap.context()` ou `gsap.matchMedia()` por cena e reverta no cleanup. O alias `gsap.ts` oferece o mesmo export.
- `tokens.ts`: três famílias de easing e durações compartilhadas. `ease` contém curvas para Motion; `gsap` contém as equivalentes de intenção para timelines. Sem springs elásticos.
- `device.ts`: leitura segura de preferências/dispositivo e agendamento ocioso cancelável.
- `scroll.ts`: `scrollSceneTo(top, { immediate? })` navega até coordenadas de cena usando Lenis quando disponível e scroll nativo nos demais casos. É também reexportado por `runtime.ts`. Respeita movimento reduzido e não força scroll durante o bloqueio de modais.
- `sequence.ts`: tipos e funções puras usados pelo canvas, com testes em `tests/sequence.test.mjs`.

Monte `MotionRuntime` uma vez no layout. Ele importa Lenis apenas em desktop a partir de 1024 px com ponteiro fino, sem movimento reduzido, Save Data ou rede 2G/3G. Touch continua com scroll nativo. Lenis usa o ticker do GSAP (segundos convertidos em milissegundos); a atualização chama ScrollTrigger. Modais e `body { overflow: hidden }` suspendem o smooth scroll. Anchors reservam ao menos 84 px para o header, considerando o `scroll-padding` já existente no CSS para não duplicar esse espaço. Um CSS mínimo neutraliza o `scroll-behavior: smooth` nativo enquanto Lenis está presente.

O componente observa alterações de media queries e conexão. Cleanup remove ticker, eventos, MutationObservers e a instância Lenis; cenas são responsáveis por seus próprios ScrollTriggers. Falhar o download dessas bibliotecas deixa o scroll nativo disponível.

Botões de capítulos devem usar `scrollSceneTo()` em vez de `window.scrollTo()` diretamente. Isso evita disputar com uma interpolação Lenis em andamento. As coordenadas numéricas não recebem offset adicional; `anchorOffsetForPadding()` é usado apenas nos anchors de elemento e desconta o `scroll-padding` que Lenis já considera (84 px no CSS atual → offset adicional 0).

`RevealText` e `RevealImage`, em `components/motion/reveal.tsx`, carregam o runtime apenas quando se aproximam da viewport. Texto usa spans com palavras reais e espaços selecionáveis: o conteúdo não fica oculto no HTML inicial. Elementos já visíveis no carregamento não são escondidos posteriormente para animar. `split="lines"` usa quebras explícitas `\n`, sem medir e reconstruir linhas a cada resize. Movimento reduzido preserva a apresentação estática.

Exemplo:

```tsx
<RevealText as="h2" text="Uma presença.\nA sua." split="lines" />
<RevealImage className="editorial-photo">{image}</RevealImage>
```

GSAP controla cenas; Motion controla menus, modais, escolhas e outros estados da interface. Não use os dois para controlar a mesma propriedade do mesmo elemento.

Referências consultadas: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) e [Lenis](https://github.com/darkroomengineering/lenis). A implementação segue também a documentação de lazy loading e client boundaries empacotada na versão de Next.js instalada.
