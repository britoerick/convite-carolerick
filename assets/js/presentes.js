/* ==========================================================================
   Lista de presentes: botão "Copiar chave Pix".
   A chave exibida fica em index.html (elemento #pixKey).
   ========================================================================== */
(function () {
  var botao = document.getElementById('copyPix');
  var chave = document.getElementById('pixKey');
  var aviso = document.getElementById('pixStatus');
  var tempo;
  var textoOriginal = botao.textContent;

  function selecionarChave() {
    try {
      var faixa = document.createRange(); faixa.selectNodeContents(chave);
      var selecao = window.getSelection(); selecao.removeAllRanges(); selecao.addRange(faixa);
    } catch (e) {}
  }
  // mostra o aviso para leitores de tela e troca o texto do botão por 3 segundos
  function avisar(mensagem, rotulo) {
    aviso.textContent = mensagem;
    botao.textContent = rotulo;
    clearTimeout(tempo);
    tempo = setTimeout(function () { aviso.textContent = ''; botao.textContent = textoOriginal; }, 3000);
  }

  botao.addEventListener('click', function () {
    var texto = chave.textContent.trim();
    function concluir(ok) {
      if (ok) { avisar('Chave copiada. É só colar no app do seu banco.', 'Chave copiada'); }
      else { selecionarChave(); avisar('Selecione e copie a chave acima.', 'Selecione e copie a chave'); }
    }
    function copiarAntigo() {   // navegadores sem a API de área de transferência
      var ok = false;
      try {
        var campo = document.createElement('textarea');
        campo.value = texto; campo.setAttribute('readonly', '');
        campo.style.position = 'fixed'; campo.style.opacity = '0';
        document.body.appendChild(campo); campo.select();
        ok = document.execCommand('copy'); document.body.removeChild(campo);
      } catch (e) {}
      concluir(ok);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(function () { concluir(true); }, copiarAntigo);
    } else { copiarAntigo(); }
  });
})();
