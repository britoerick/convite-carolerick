/* ==========================================================================
   Navegação entre as três telas: convite, lista de presentes e confirmação.
   A troca é feita aqui, por conta própria, sem depender da navegação nativa por âncora (#),
   que é bloqueada em alguns navegadores embutidos e visualizadores (os botões ficavam "mortos").
   ========================================================================== */
(function () {
  var telas = {
    convite: document.getElementById('convite'),
    presentes: document.getElementById('presentes'),
    confirmar: document.getElementById('confirmar')
  };
  var tituloBase = document.title;
  var titulos = {
    presentes: 'Lista de presentes · Carol e Erick',
    confirmar: 'Confirmar presença · Carol e Erick'
  };

  function mostrar(nome) {
    if (!telas[nome]) { nome = 'convite'; }
    Object.keys(telas).forEach(function (k) { telas[k].hidden = (k !== nome); });
    document.title = titulos[nome] || tituloBase;
    window.scrollTo(0, 0);
  }
  function aoMudarEndereco() { mostrar(location.hash.replace('#', '')); }

  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link) { return; }
    var nome = link.getAttribute('href').slice(1);
    if (!telas[nome]) { return; }
    e.preventDefault();
    mostrar(nome);
    // atualiza o endereço (botão voltar do celular); em ambientes isolados isso é bloqueado e segue sem alterar
    try { history.pushState({ tela: nome }, '', '#' + nome); } catch (erro) { /* sem problema */ }
  });
  window.addEventListener('popstate', aoMudarEndereco);
  window.addEventListener('hashchange', aoMudarEndereco);
  aoMudarEndereco();
})();
