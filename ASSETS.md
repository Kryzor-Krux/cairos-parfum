# Procedência visual e uso atual — V4

## Fotografias de produto

Os originais foram preservados em `public/images/`. A aplicação usa suas versões WebP com `next/image`, dimensões declaradas e `sizes`. Fundos, luzes e `mix-blend-mode: multiply` compõem a apresentação; não existe um modelo 3D do frasco.

| Originais / arquivo servido | Fonte registrada no projeto | Uso atual |
| --- | --- | --- |
| `qahwa.jpg` / `qahwa.webp` | [Lattafa — imagem do Khamrah Qahwa](https://lattafa.com/wp-content/uploads/2024/05/2-79.jpg) | Galeria, Atelier, transição do hero e imagem alternativa da história. |
| `pisa.jpg` / `pisa.webp` | [Lattafa — imagem do Pisa](https://lattafa.com/wp-content/uploads/2024/07/2-10.jpg) | Galeria e Atelier. |
| `qaed.jpg` / `qaed.webp` | [Lattafa — imagem do Qaed Al Fursan](https://lattafa.com/wp-content/uploads/2024/05/2-102.jpg) | Galeria e Atelier. |
| `sabah.png` / `sabah.webp` | [Al Wataniah — imagem do Sabah Al Ward](https://cdn.shopify.com/s/files/1/0679/9871/1877/files/sabah-al-ward.png?v=1759755351) | Galeria e Atelier. |

As páginas de produto usadas como fonte de notas são [Khamrah Qahwa](https://lattafa.com/product/khamrah-qahwa/), [Pisa](https://lattafa.com/product/pisa/), [Qaed Al Fursan](https://lattafa.com/product/qaed-al-fursan/) e [Sabah Al Ward](https://www.alwataniah.com/products/sabah-al-ward). Os links também estão em `src/data/perfumes.ts`; a narrativa do Qahwa reutiliza essas mesmas listas de notas.

## Imagens geradas para a campanha

| Arquivo | Procedência | Uso atual |
| --- | --- | --- |
| `hero-campaign.webp` | Imagem gerada com IA em 26/09/2026, usando a fotografia oficial do Qahwa como referência de produto. 1536 × 1024 px; 217.120 bytes. | Abertura cinematográfica e imagem social Open Graph/Twitter. |
| `sensory-material.webp` | Imagem gerada com IA em 26/09/2026: seda bordô, reflexos âmbar e grãos de café, sem frasco ou marca. 1536 × 1024 px; 155.704 bytes. | Fundo da história sensorial e da seção final de contato. |
| `atmosphere.png` / `atmosphere.webp` | Cenário gerado anteriormente para o projeto: travertino, luz quente e espaço negativo, sem produto, marca ou texto. | Arquivos de origem preservados; não referenciados pela interface V4. |

A imagem de campanha do hero é uma interpretação visual gerada, não uma fotografia oficial de campanha do fabricante. A fotografia oficial continua sendo a referência para os detalhes do produto na galeria, no resultado do Atelier e no fallback da história. A névoa e as mudanças de iluminação são camadas CSS animadas; não correspondem a vídeo, simulação física ou novos frames de produto.

[CAMPAIGN-ASSETS.md](CAMPAIGN-ASSETS.md) registra prompts, referências, arquivos PNG de origem e conversão das duas imagens de campanha. Não altere rótulos ou embalagem para produzir uma aparência diferente do produto comercializado.

## Fontes e assinatura

| Família / peso | Arquivo servido por `next/font/local` | Tamanho local |
| --- | --- | ---: |
| Cormorant Garamond 400 | `public/fonts/cormorant-garamond-400.woff2` | 63.544 bytes |
| Manrope 400 | `public/fonts/manrope-400.woff2` | 30.316 bytes |
| Manrope 600 | `public/fonts/manrope-600.woff2` | 30.404 bytes |
| **Total das três fontes utilizadas** | | **124.264 bytes** |

As fontes vieram do Google Fonts e são hospedadas localmente. Os TTF originais e os arquivos `cormorantgaramond-LICENSE.txt` e `manrope-LICENSE.txt` permanecem em `public/fonts/`. O Cormorant 500 existente não é referenciado pelo layout. O layout usa `display: swap`; o itálico atual depende da síntese do navegador, pois não foi adicionado um desenho italic.

A conversão integral de TTF para WOFF2 e suas verificações estão documentadas em [FONT-ASSETS.md](FONT-ASSETS.md). A redução de 480.304 para 124.264 bytes é uma comparação entre arquivos locais; não é uma medição de transferência HTTP ou de Core Web Vitals.

A assinatura CAIRO’S PARFUM, o monograma tipográfico e o favicon SVG são estudos criados para o projeto. Podem ser substituídos pelos arquivos de identidade oficial da marca quando disponíveis. Os ícones de interface são fornecidos pela dependência `lucide-react`.

## Sequência futura do Qahwa

`public/sequences/qahwa/` contém documentação, mas nenhum frame de rotação. A cena usa `ImageSequence` sem manifest e mostra `qahwa.webp`. O canvas está preparado para receber uma sequência real, com carregamento limitado e imagem alternativa; a implementação não fabrica uma rotação a partir da foto estática.

Os caminhos de inserção, manifest, variantes mobile/desktop e critérios de validação estão em [public/sequences/qahwa/README.md](public/sequences/qahwa/README.md). Só habilite o manifest quando todos os arquivos reais estiverem presentes e revisados.

## Relatos e informações comerciais

Os relatos exibidos vêm do PDF `Cairos_Parfum_Stories_e_Referencias.pdf` fornecido pelo usuário: página 16 (So Candid), página 15 (Club de Nuit) e página 19 (Fakhar Black). São transcrições; nenhuma captura de conversa, avatar ou identidade de cliente está publicada na V4. O componente `Voices` tem campo opcional para screenshots futuros.

Contatos, região de atendimento e informação de entrega foram mantidos das referências públicas registradas no projeto. As descrições sensoriais são editoriais; não representam testes de duração, garantia de projeção ou comprovação de estoque. Disponibilidade e valor são consultados pelo WhatsApp.

Direitos sobre fotografias e marcas permanecem com seus titulares. A disponibilidade pública de um arquivo não equivale a uma licença de uso comercial.
