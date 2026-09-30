# Sequência do Khamrah Qahwa

O projeto não contém uma rotação fotografada ou renderizada do frasco. Nenhum frame foi inventado. A cena atual usa a fotografia oficial existente e iluminação/composição controladas pelo scroll. `ImageSequence` mantém essa imagem visível sem JavaScript, sem manifest e quando a rede ou o dispositivo pedem uma experiência mais leve.

## Onde inserir o material futuro

Depois de produzir e aprovar uma sequência consistente do frasco real, exporte arquivos WebP individuais nestes caminhos:

```text
public/sequences/qahwa/desktop/0001.webp
public/sequences/qahwa/desktop/0002.webp
…
public/sequences/qahwa/mobile/0001.webp
public/sequences/qahwa/mobile/0002.webp
…
```

Não basta duplicar a mesma fotografia. Os frames devem representar a mesma câmera, luz e fundo, com movimento contínuo. Use proporção e enquadramento consistentes, verifique o rótulo do produto e exporte uma versão mobile menor. Como ponto de partida para produção de material: 72 frames desktop de até 1024 px de largura e 36 frames mobile de até 720 px; avalie compressão e legibilidade em aparelhos reais antes de publicar. Esses números são sugestões de produção, não arquivos disponíveis neste projeto.

## Manifest e integração

O manifest deve ser uma constante fora do componente. Só o forneça depois que todos os caminhos existirem. Sem manifest não há tentativas de buscar frames nem erros 404.

```tsx
import { useRef } from "react";
import { ImageSequence, type ImageSequenceHandle } from "@/components/storytelling/image-sequence";
import type { SequenceManifest } from "@/lib/motion/sequence";

// Exemplo para ativar SOMENTE depois de adicionar os arquivos reais.
const qahwaSequence: SequenceManifest = {
  frameCount: 72,
  path: "/sequences/qahwa/desktop/{frame}.webp",
  startFrame: 1,
  pad: 4,
  mobile: {
    breakpoint: 768,
    frameCount: 36,
    path: "/sequences/qahwa/mobile/{frame}.webp",
    startFrame: 1,
    pad: 4,
  },
};

const sequenceRef = useRef<ImageSequenceHandle>(null);

// Dentro da cena, em um container com altura/largura definidas:
<ImageSequence
  ref={sequenceRef}
  manifest={qahwaSequence}
  fallback={{ src: "/images/qahwa.webp", alt: "Khamrah Qahwa, Lattafa", sizes: "(max-width: 767px) 100vw, 60vw" }}
  fit="contain"
  className="qahwa-sequence"
/>

// A timeline da cena controla o progresso normalizado, sem setState por pixel:
sequenceRef.current?.seek(progress); // de 0 a 1; valores externos são limitados
```

`path` aceita o marcador `{frame}`, substituído pelo índice mais `startFrame` e preenchido com zeros conforme `pad`. Alternativamente, passe `urls: ["/frame-a.webp", ...]` com uma URL por frame. `frameCount` é obrigatório. `mobile.breakpoint` usa pixels CSS e seleciona a versão mobile abaixo do valor informado. `fit` aceita `cover` ou `contain`; o fallback e o canvas usam o mesmo modo. A imagem alternativa permanece no DOM para leitores de tela; o canvas é decorativo.

## Carregamento e limites

- Só prepara a sequência quando o container se aproxima da tela (margem de 600 px).
- Busca primeiro o frame de abertura. Os próximos downloads entram em períodos ociosos, priorizando o frame solicitado pelo scroll e amostras distribuídas pela cena.
- Pré-carrega no máximo 8 frames em mobile e 16 em desktop; ao explorar outros momentos, solicita apenas o frame necessário.
- Mantém até 12 frames decodificados no mobile e 20 no desktop, descartando os mais distantes do momento atual. Quando suportado, decodifica em largura de 640/768 px; Safari sem resize de bitmap usa a imagem compatível.
- Usa no máximo 1 download simultâneo no mobile e 2 no desktop. O canvas limita DPR a 1,5/1,75 e redimensiona com `ResizeObserver`.
- Enquanto o frame exato não chega, mostra o frame carregado mais próximo. Falhas de rede preservam os frames disponíveis ou o fallback.
- Desativa sequências com `prefers-reduced-motion`, Save Data, conexão 2G/3G ou memória informada de até 4 GB. A ausência dessas APIs não é tratada como falha.
- Mudar breakpoint, preferência de movimento ou conexão desmonta a sessão anterior. Remover a cena cancela fetches, callbacks ociosos e RAFs, desconecta observers e libera bitmaps.

GSAP deve chamar `seek()`; não aplique Motion ao mesmo canvas ou aos mesmos transforms controlados pela timeline. A composição pode manter outros elementos em camadas independentes.

## Validação ao adicionar os frames

1. Verifique todos os arquivos do manifest, inclusive primeiro e último de cada variante.
2. Teste 390 × 844 e desktop, incluindo ida/volta rápida no scroll e resize durante a cena.
3. Teste falha de um frame, rede lenta, Save Data e movimento reduzido: o conteúdo deve permanecer visível.
4. Inspecione peso total, memória e fluidez em Android real. Reduza resolução, frames e duração quando necessário.
5. Rode `npm test` e `npm run typecheck`; os testes cobrem índices, URLs, escolha de variante e orçamento de preload.
