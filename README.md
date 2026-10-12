# Convite de casamento — Carol e Erick

Site do convite (23/10/2026, Platter for You, Natal). Três telas em uma só página: **convite**, **lista de presentes**
(Amazon + Pix) e **confirmação de presença** (formulário que grava numa planilha do Google).

Feito para **celular em primeiro lugar**. É um site estático: só HTML, CSS, JavaScript e uma imagem, sem servidor.

## Estrutura

```
site-convite/
├── index.html                  Textos e estrutura das três telas
├── assets/
│   ├── css/
│   │   ├── base.css            Cores, espaçamentos, fontes e tipografia geral
│   │   ├── papel.css           Fundo de papel branco com relevo
│   │   ├── componentes.css     Botões, linha vertical, cabeçalho das telas internas
│   │   ├── capa.css            Monograma, nomes, data e frase de abertura
│   │   ├── detalhes.css        Dia, horário, local e botões
│   │   ├── encerramento.css    Versículo
│   │   ├── presentes.css       Lista da Amazon e Pix
│   │   ├── confirmacao.css     Formulário de confirmação
│   │   ├── ramos.css           Posição dos ramos de oliveira
│   │   ├── animacoes.css       Animação dos ramos
│   │   └── responsivo.css      Ajustes para telas largas (carregado por último)
│   ├── js/
│   │   ├── config.js           ★ Configurações (endereço do Google, e-mail, frase final)
│   │   ├── ramos.js            Desenho dos ramos (GERADO — veja tools/)
│   │   ├── animacoes.js        Animação dos ramos ao entrar e sair da tela
│   │   ├── navegacao.js        Troca entre as três telas
│   │   ├── presentes.js        Botão "Copiar chave Pix"
│   │   └── confirmacao.js      Formulário de confirmação
│   └── img/
│       └── monograma-ce.webp   Monograma
├── backend/
│   └── apps-script-confirmacao.gs   Script do Google que recebe as confirmações
├── docs/
│   ├── publicar.md             Como colocar no ar
│   └── google-apps-script.md   Como ligar a planilha e o e-mail
├── tools/
│   ├── gerar-ramos.py          Gera o assets/js/ramos.js
│   └── gerar-arquivo-unico.py  Junta tudo em um único HTML
└── dist/
    └── convite-arquivo-unico.html   Site inteiro em um só arquivo (gerado; refaça se mudar algo)
```

A ordem dos arquivos CSS no `index.html` importa (os últimos podem sobrescrever os primeiros): mantenha-a.

## Onde mudar cada coisa

| Quero mudar… | Onde |
|---|---|
| Nomes, data, frase de abertura, local, endereço, versículo | `index.html` |
| Link do mapa, link da lista da Amazon, chave Pix | `index.html` (procure `maps.app.goo.gl`, `amazon.com.br`, `pixKey`) |
| Endereço do Google que recebe as confirmações | `assets/js/config.js` |
| Frase mostrada a quem confirma presença | `assets/js/config.js` (`quandoOnde`) |
| Título e descrição que aparecem na prévia do WhatsApp | `index.html`, no começo (`<title>`, `description`, `og:`) |
| Cores e espaçamentos | `assets/css/base.css` (variáveis no começo) |
| Fontes | `index.html` (link do Google Fonts) e `assets/css/base.css` (`--serif`, `--names`) |
| Monograma | Troque `assets/img/monograma-ce.webp` (mantenha a proporção) |
| Desenho dos ramos de oliveira | `tools/gerar-ramos.py` e depois `python3 tools/gerar-ramos.py` |
| Tamanho e posição dos ramos | `assets/css/ramos.css` |
| Tempo da animação | `assets/css/animacoes.css` (duração) e `tools/gerar-ramos.py` (atrasos) |
| Opções do formulário (quantidade de pessoas) | `index.html` (`<select id="qtd">`) |
| Planilha e e-mail de aviso | `backend/apps-script-confirmacao.gs` (veja `docs/google-apps-script.md`) |

## Como funciona (resumo)
- **Três telas, uma página:** `navegacao.js` mostra uma tela por vez. Não usa a navegação nativa por âncora (`#`),
  que é bloqueada em alguns navegadores embutidos (era isso que deixava os botões mortos).
- **Confirmação:** `confirmacao.js` envia os dados ao Google Apps Script (`POST`, sem esperar resposta) e mostra o agradecimento.
  Links com `?convidado=Maria` abrem com "Olá, Maria".
- **Ramos de oliveira:** inseridos por `ramos.js` e animados por CSS. A animação recomeça sempre que o trecho sai da tela e volta.
  Quem ativou "reduzir movimento" no aparelho vê os desenhos prontos, sem animar.
- **Fontes:** vêm do Google Fonts (Gilda Display e Cormorant). Sem internet, o site usa fontes do sistema.

## Publicar e configurar
- Publicação: `docs/publicar.md`
- Planilha e e-mail das confirmações: `docs/google-apps-script.md`

## Observações
- Sem JavaScript o texto aparece, mas os ramos de oliveira, a troca de telas e o formulário não funcionam.
- O endereço do script do Google fica visível no código da página; o formulário bloqueia robôs simples (campo-isca).
