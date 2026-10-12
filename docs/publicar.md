# Publicar o convite

O site é **estático**: são só arquivos (HTML, CSS, JavaScript e imagem). Não precisa de servidor próprio.
Publique a **pasta inteira** `site-convite` (com `index.html` na raiz da pasta).

## Opção 1 — Netlify (a mais simples)
1. Acesse https://app.netlify.com/drop (crie uma conta gratuita se pedir).
2. **Arraste a pasta `site-convite`** para a página.
3. Em segundos você recebe um endereço como `nome-aleatorio.netlify.app`. Em *Site settings → Change site name*
   dá para escolher um nome melhor (por exemplo, `caroleerick.netlify.app`).
4. Para atualizar depois: *Deploys → arraste a pasta de novo*.

## Opção 2 — GitHub Pages
1. Crie um repositório no GitHub e envie o conteúdo da pasta `site-convite` (o `index.html` deve ficar na raiz).
2. Em *Settings → Pages*, escolha a branch principal e a pasta `/ (root)`.
3. O endereço será `seu-usuario.github.io/nome-do-repositorio`.

## Opção 3 — Um único arquivo
Se a hospedagem aceitar só um arquivo, gere a versão única:

```
python3 tools/gerar-arquivo-unico.py
```

O resultado fica em `dist/convite-arquivo-unico.html` (renomeie para `index.html` ao enviar).

## Ver no próprio computador
- **Duplo clique** em `index.html` funciona (o site não precisa de servidor).
- Ou, com Python instalado, rode `python3 -m http.server 8000` dentro da pasta e abra http://localhost:8000.

## Antes de enviar aos convidados
- [ ] Abra o endereço publicado **no celular**, toque em **Confirmar presença** e em **Lista de presentes**
      (a tela deve trocar, e o botão "Voltar ao convite" deve voltar).
- [ ] Envie uma confirmação de teste e confira a planilha e o e-mail (veja `docs/google-apps-script.md`).
- [ ] Abra a lista da Amazon pelo botão e veja se ela está **pública** (sem pedir login).
- [ ] Mande o link para você mesmo pelo WhatsApp e confira o título e a descrição que aparecem na prévia.

## Dica de privacidade (opcional)
Para o convite não aparecer em buscas do Google, acrescente dentro do `<head>` do `index.html`:

```html
<meta name="robots" content="noindex">
```
