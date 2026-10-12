# Receber as confirmações (Google Planilhas + e-mail)

O formulário do convite envia cada confirmação para um **Google Apps Script**, que grava uma linha numa
planilha e manda um e-mail de aviso. É gratuito e leva uns 10 minutos.

> **Situação atual:** o endereço do script **já está** em `assets/js/config.js`. Se você só quer conferir
> que está funcionando, vá direto ao [Teste final](#teste-final).

## 1. Criar a planilha e o script
1. Entre em https://sheets.new com a conta que vai receber os avisos e dê um nome à planilha
   (por exemplo, "Confirmações do casamento").
2. No menu, abra **Extensões → Apps Script**.
3. Apague o código que aparece e cole todo o conteúdo de `backend/apps-script-confirmacao.gs`.
4. No topo do arquivo, confira `NOTIFY_EMAIL` (e-mail que recebe o aviso a cada resposta).
5. Clique no ícone de disquete (**Salvar**).

## 2. Publicar o script
1. Clique em **Implantar → Nova implantação**.
2. Na engrenagem ao lado de "Selecionar tipo", escolha **App da Web**.
3. Preencha:
   - **Executar como:** Eu
   - **Quem pode acessar:** **Qualquer pessoa** (obrigatório: os convidados não têm conta Google)
4. Clique em **Implantar** e autorize quando o Google pedir. Ele avisa que o app "não foi verificado":
   clique em *Avançado → Acessar (nome do projeto)*. O script é seu e só precisa de permissão
   para escrever na planilha e enviar e-mail.
5. Copie a **URL do app da Web** (termina em `/exec`).

> Teste rápido: cole essa URL no navegador. Deve aparecer **"Confirmações ativas."**

## 3. Ligar o convite ao script
Abra `assets/js/config.js` e cole a URL em `rsvpEndpoint`:

```js
rsvpEndpoint: 'https://script.google.com/macros/s/XXXXXXXX/exec',
```

## Teste final
1. Abra o convite publicado no celular, toque em **Confirmar presença** e envie uma resposta de teste.
2. Confira se apareceu **uma linha na planilha** e **um e-mail** no endereço de aviso.
3. Apague a linha de teste da planilha.

Se não chegar nada, o motivo mais comum é "Quem pode acessar" não estar como **Qualquer pessoa**.
Corrija em *Implantar → Gerenciar implantações → Editar → Nova versão*.

> Sempre que você alterar o script, é preciso criar uma **nova versão** da implantação.
> Salvar não basta.

## O que é gravado
| Coluna | Conteúdo |
|---|---|
| Data e hora | Quando a resposta chegou |
| Presença | "Vai" ou "Não vai" |
| Qtd. de pessoas | Quantas pessoas o convidado informou |
| Convidados | Os nomes, separados por vírgula |
| Link do convite | O nome do link, se foi usado `?convidado=...` |

## Observações
- **Um link por convidado:** acrescente `?convidado=Nome` ao endereço do convite e a tela de confirmação
  abre com "Olá, Nome". Exemplo: `https://seusite.com/?convidado=Maria`.
- **Privacidade:** as respostas ficam só na sua planilha.
- **Spam:** o endereço do script fica visível no código da página, então alguém poderia enviar respostas
  falsas. O formulário já bloqueia robôs simples (campo-isca). O Gmail comum envia cerca de 100 e-mails
  por dia; vale olhar a planilha nos dias antes da festa.
