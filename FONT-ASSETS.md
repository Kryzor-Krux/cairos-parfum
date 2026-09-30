# Fontes locais — Cairo’s Parfum

As três fontes utilizadas no site foram convertidas integralmente de TTF para WOFF2. Os TTF de origem e as licenças foram preservados em `public/fonts/`. Não houve subsetting, troca de desenho, remoção de caracteres ou mudança de peso.

| Fonte | Origem TTF | WOFF2 servido | Glifos preservados |
| --- | ---: | ---: | ---: |
| Cormorant Garamond Regular 400 | 290.236 bytes | 63.544 bytes | 1.308 |
| Manrope Regular 400 | 94.972 bytes | 30.316 bytes | 737 |
| Manrope SemiBold 600 | 95.096 bytes | 30.404 bytes | 737 |
| **Total** | **480.304 bytes** | **124.264 bytes** | — |

A redução dos arquivos é de **356.040 bytes (74,1%)**. Esses números comparam os arquivos; não representam uma medição de transferência HTTP ou de Core Web Vitals. O browser recebe apenas os formatos referenciados por `next/font/local`.

## Arquivos para o layout

- `public/fonts/cormorant-garamond-400.woff2`
- `public/fonts/manrope-400.woff2`
- `public/fonts/manrope-600.woff2`

Os nomes de família, os pesos e as métricas permanecem iguais. O Cormorant 500, já existente entre os originais, não é utilizado pelo layout e não foi convertido. A conversão também não acrescenta um desenho italic: o uso atual de itálico continua dependente da síntese do navegador.

## Processo reproduzível

Conversão realizada com **fontTools 4.66.1** e **Brotli 1.2.0**, instalados como ferramentas temporárias fora das dependências da aplicação. O encoder WOFF2 do fontTools foi usado para os arquivos entregues. Nenhum encoder manual faz parte do projeto.

Em um ambiente Python com pip, a conversão pode ser repetida a partir da raiz do projeto:

```bash
python3 -m pip install --target /tmp/cairos-font-tools 'fonttools[woff]==4.66.1' 'brotli==1.2.0'
PYTHONPATH=/tmp/cairos-font-tools python3 - <<'PY'
from pathlib import Path
from fontTools.ttLib import TTFont

for name in ('cormorant-garamond-400', 'manrope-400', 'manrope-600'):
    source = Path('public/fonts') / f'{name}.ttf'
    font = TTFont(source, recalcTimestamp=False)
    font.flavor = 'woff2'
    font.save(source.with_suffix('.woff2'))
PY
```

## Validação realizada

- Reabertura de todos os arquivos pelo fontTools e, independentemente, pelo FreeType/fontconfig (`fc-scan`).
- Cobertura Unicode completa idêntica entre origem e resultado, incluindo letras latinas e acentos do português brasileiro.
- Contornos e coordenadas de todos os glifos comparados após decodificação: idênticos.
- Tabelas de posicionamento e substituição (`GPOS`, `GSUB`, `GDEF` quando presente), métricas (`hmtx`, `hhea`, `OS/2`) e nomes comparadas: idênticas.
- Leitura com o mesmo fontkit empacotado pelo Next usado por `next/font/local`: número de glifos, cobertura, unidades por em, ascendente, descendente e entrelinha idênticos.
- Shaping de uma amostra com nomes, pontuação, acentos e cedilha: os 76 glifos e todas as posições/avanços coincidem entre TTF e WOFF2.
- Os hashes dos TTF de origem permaneceram iguais durante a conversão.

Amostra de shaping:

> Cairo’s Parfum · Presença, café, âmbar, coração. ÀÁÂÃÇÉÊÍÓÔÕÚÜ àáâãçéêíóôõúü

Hashes SHA-256 dos arquivos finais:

```text
cormorant-garamond-400.woff2  d4a478b1420d2e62a0efa989b67bd330d2af60bbe6931cb8c3fc949672516281
manrope-400.woff2            9e9e02e13969e6cc057d4aeccac39cde2df1c63adeb4b9fcfeac2e259fa6439c
manrope-600.woff2            aa357afe8ae1aada344349a7729d3615a34dc0a3ac29ba8a709c85fee69d80bc
```

Licenças: `public/fonts/cormorantgaramond-LICENSE.txt` e `public/fonts/manrope-LICENSE.txt`. A documentação de origem dos assets continua em `ASSETS.md`.
