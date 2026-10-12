/* ==========================================================================
   Confirmação de presença
   - o convidado escolhe "sim" ou "não", a quantidade de pessoas e os nomes;
   - os dados são enviados ao Google Apps Script (endereço em assets/js/config.js);
   - links com ?convidado=Maria abrem com "Olá, Maria" e o nome já preenchido.
   ========================================================================== */
(function () {
  var config = window.CONVITE || {};
  var ENDERECO = config.rsvpEndpoint || '';
  var EMAIL_PLANO_B = config.rsvpEmail || '';
  var QUANDO_ONDE = config.quandoOnde || '';

  var convidado = (new URLSearchParams(location.search).get('convidado') || '').trim().slice(0, 80);
  var form = document.getElementById('rsvpForm');
  var mais = document.getElementById('rsvpMore');
  var campoQuantidade = document.getElementById('countField');
  var quantidade = document.getElementById('qtd');
  var camposNomes = document.getElementById('nameFields');
  var mensagem = document.getElementById('formMsg');
  var botaoEnviar = document.getElementById('sendBtn');
  var caixaFinal = document.getElementById('rsvpDone');
  var saudacao = document.getElementById('rsvpGreeting');
  // só preenche o nome sozinho quando o link é de uma pessoa (não de um casal ou família)
  var nomeInicial = convidado && !/[&,]| e /i.test(convidado) ? convidado : '';

  if (convidado) { saudacao.textContent = 'Olá, ' + convidado; saudacao.hidden = false; }

  function presenca() {
    var marcada = form.querySelector('input[name="presenca"]:checked');
    return marcada ? marcada.value : '';
  }

  // cria um campo de nome para cada pessoa (1 se não vai; a quantidade escolhida se vai)
  function montarCamposDeNomes() {
    var n = presenca() === 'sim' ? parseInt(quantidade.value, 10) : 1;
    var anteriores = [].map.call(camposNomes.querySelectorAll('input'), function (i) { return i.value; });
    camposNomes.innerHTML = '';
    for (var i = 0; i < n; i++) {
      var bloco = document.createElement('div'); bloco.className = 'field';
      var rotulo = document.createElement('label'); rotulo.className = 'pressed';
      rotulo.htmlFor = 'nome' + i;
      rotulo.textContent = i === 0 ? 'Seu nome' : 'Nome do convidado ' + (i + 1);
      var campo = document.createElement('input');
      campo.className = 'input'; campo.type = 'text'; campo.id = 'nome' + i; campo.name = 'nome';
      campo.maxLength = 80; campo.autocomplete = i === 0 ? 'name' : 'off';
      campo.value = anteriores[i] || (i === 0 ? nomeInicial : '');
      bloco.appendChild(rotulo); bloco.appendChild(campo); camposNomes.appendChild(bloco);
    }
  }

  form.addEventListener('change', function (e) {
    if (e.target.name === 'presenca') {
      mais.hidden = false;
      campoQuantidade.hidden = presenca() !== 'sim';
      mensagem.textContent = '';
      montarCamposDeNomes();
    } else if (e.target === quantidade) {
      montarCamposDeNomes();
    }
  });

  function enviar(dados) {
    if (ENDERECO) {
      return fetch(ENDERECO, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(dados)
      });
    }
    // Endereço ainda não configurado: abre o e-mail com a confirmação pronta
    var assunto = (dados.presenca === 'sim' ? 'Confirmação de presença' : 'Não poderei comparecer') + ' · ' + dados.convidados[0];
    var corpo = 'Presença: ' + (dados.presenca === 'sim' ? 'confirmada' : 'não poderei ir') + '\n' +
      'Convidados (' + dados.quantidade + '): ' + dados.convidados.join(', ') + '\n' +
      '';
    window.location.href = 'mailto:' + EMAIL_PLANO_B + '?subject=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(corpo);
    return Promise.resolve();
  }

  function mostrarAgradecimento(p) {
    form.hidden = true;
    var porEmail = !ENDERECO;
    document.getElementById('doneTitle').textContent = porEmail ? 'Falta só enviar o e-mail' : (p === 'sim' ? 'Presença confirmada' : 'Obrigado por avisar');
    document.getElementById('doneText').textContent = porEmail
      ? 'Abrimos o seu e-mail com a confirmação pronta. É só tocar em enviar'
      : (p === 'sim'
          ? 'Esperamos você ' + QUANDO_ONDE
          : 'Sentiremos a sua falta, mas agradecemos o carinho');
    caixaFinal.hidden = false;
  }

  document.getElementById('again').addEventListener('click', function () {
    form.reset();
    camposNomes.innerHTML = '';
    mais.hidden = true;
    mensagem.textContent = '';
    botaoEnviar.disabled = false; botaoEnviar.textContent = 'Enviar confirmação';
    caixaFinal.hidden = true; form.hidden = false;
    window.scrollTo(0, 0);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    mensagem.textContent = '';
    var p = presenca();
    if (!p) { mensagem.textContent = 'Escolha uma das opções para continuar'; return; }
    var campos = camposNomes.querySelectorAll('input'), nomes = [];
    for (var i = 0; i < campos.length; i++) {
      var v = campos[i].value.trim();
      if (!v) { mensagem.textContent = campos.length > 1 ? 'Preencha o nome de todos os convidados' : 'Preencha o seu nome'; campos[i].focus(); return; }
      nomes.push(v);
    }
    if (form.elements.website && form.elements.website.value) { mostrarAgradecimento(p); return; }   // campo-isca: robô
    var dados = {
      presenca: p, quantidade: nomes.length, convidados: nomes,
      convite: convidado, enviadoEm: new Date().toISOString()
    };
    botaoEnviar.disabled = true; botaoEnviar.textContent = 'Enviando…';
    enviar(dados).then(function () { mostrarAgradecimento(p); }, function () {
      mensagem.textContent = 'Não foi possível enviar agora. Tente de novo em instantes';
      botaoEnviar.disabled = false; botaoEnviar.textContent = 'Enviar confirmação';
    });
  });
})();
