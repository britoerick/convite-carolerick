/* ==========================================================================
   Animações dos ramos de oliveira
   - os ramos do fim se desenham quando o convidado chega neles;
   - os do topo se desenham ao abrir a página;
   - nos dois casos a animação recomeça sempre que o trecho sai da tela e volta.
   O CSS correspondente está em assets/css/animacoes.css.
   Quem pediu "reduzir movimento" no aparelho vê os desenhos prontos, sem animar.
   ========================================================================== */
(function () {
  var raiz = document.documentElement;
  raiz.classList.add('js');

  var reduzirMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduzirMovimento || !('IntersectionObserver' in window)) { return; }

  var LIMIAR = 0.12;   // parte do trecho que precisa aparecer para a animação começar

  // aoEntrar: chamado quando o trecho aparece; aoSair: quando sai por completo da tela
  function observar(elemento, aoEntrar, aoSair) {
    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.intersectionRatio >= LIMIAR) { aoEntrar(); }
        else if (!e.isIntersecting) { aoSair(); }
      });
    }, { threshold: [0, LIMIAR] }).observe(elemento);
  }

  // Fim da página
  var fim = document.querySelector('.end-art');
  if (fim) {
    fim.classList.add('out');
    observar(fim, function () { fim.classList.remove('out'); }, function () { fim.classList.add('out'); });
  }

  // Topo (capa)
  var capa = document.querySelector('.hero');
  if (capa) {
    observar(capa, function () { raiz.classList.remove('top-out'); }, function () { raiz.classList.add('top-out'); });
  }
})();
