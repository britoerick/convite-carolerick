#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera os ramos de oliveira do convite e escreve assets/js/ramos.js.

Uso (na raiz do projeto):   python3 tools/gerar-ramos.py

Só usa a biblioteca padrão do Python. O resultado é sempre o mesmo, porque cada desenho tem uma
"semente" fixa (SEMENTE). Para mudar o desenho, altere os números abaixo e rode de novo:
  - SEMENTE ........ muda o sorteio das folhas (ângulos, tamanhos, tons) mantendo a ideia;
  - os pontos de cada ramo (P0..P3) são uma curva: início, dois pontos de controle e fim;
  - os dois números seguintes são o comprimento da folha no começo e na ponta do ramo;
  - a lista final são galhos secundários: (posição no ramo de 0 a 1, lado -1/+1, comprimento relativo).
"""
import math, os, random

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, 'assets', 'js', 'ramos.js')

# ---------------------------------------------------------------- desenhos
# (sufixo dos ids, área visível do desenho, ramos, semente)
TOPO = dict(  # canto superior direito: ramos pendentes
    sufixo='c', caixa='0 0 220 360', semente=11,
    ramos=[
        ([(252, -30), (208, 62), (152, 150), (112, 312)], 44, 24, [(.34, -1, .36), (.6, 1, .30)]),
        ([(196, -30), (204, 40), (186, 112), (192, 200)], 38, 22, [(.45, -1, .34)]),
    ])
FIM = dict(   # fim da página, canto inferior esquerdo: ramos subindo em arco
    sufixo='b', caixa='0 30 300 350', semente=23,   # a caixa começa em y=30 para cortar o vazio do topo
    ramos=[
        ([(-20, 430), (34, 334), (84, 196), (176, 58)], 46, 24, [(.28, 1, .34), (.52, -1, .30), (.74, 1, .26)]),
        ([(30, 440), (86, 372), (160, 306), (262, 262)], 38, 22, [(.5, -1, .3)]),
        ([(-34, 392), (8, 306), (18, 226), (72, 138)], 34, 20, []),
    ])

# ---------------------------------------------------------------- cores e tempos
TONS = {'luz': ('#cfd6c4', '#9aa58d'), 'media': ('#a8b39b', '#738064'),
        'fria': ('#aebdb9', '#6f827e'), 'escura': ('#7d8a71', '#4f5a45')}   # (preenchimento, contorno)
PESOS = [('luz', .34), ('media', .36), ('fria', .12), ('escura', .18)]
COR_HASTE = '#8a7b66'
ATRASO_HASTE = .06      # segundos entre o início de uma haste e a seguinte
ATRASO_FOLHAS = .10     # quando começam as folhas (depois das hastes)
PASSO_FOLHAS = .13      # intervalo entre os grupos de tons
FORMAS = {'A': 'M0 0 C7 -4.2 20 -4.6 30 0 C20 4.6 7 4.2 0 0Z',
          'B': 'M0 0 C7 -5 20 -5.6 30 -2 C20 3.4 7 3.6 0 0Z',
          'C': 'M0 0 C7 -3.6 20 -3.4 30 2 C20 5.6 7 5 0 0Z'}


def bezier(P, t):
    u = 1 - t
    return (u**3*P[0][0] + 3*u*u*t*P[1][0] + 3*u*t*t*P[2][0] + t**3*P[3][0],
            u**3*P[0][1] + 3*u*u*t*P[1][1] + 3*u*t*t*P[2][1] + t**3*P[3][1])


def direcao(P, t):
    u = 1 - t
    dx = 3*u*u*(P[1][0]-P[0][0]) + 6*u*t*(P[2][0]-P[1][0]) + 3*t*t*(P[3][0]-P[2][0])
    dy = 3*u*u*(P[1][1]-P[0][1]) + 6*u*t*(P[2][1]-P[1][1]) + 3*t*t*(P[3][1]-P[2][1])
    return math.degrees(math.atan2(dy, dx))


def lerp(a, b, t): return a + (b - a) * t


def sortear_tom(rng):
    r = rng.random(); acc = 0
    for nome, peso in PESOS:
        acc += peso
        if r <= acc: return nome
    return 'media'


def crescer(rng, P, c0, c1, profundidade, galhos, hastes, folhas):
    """Haste + folhas alternadas (às vezes opostas) + galhos secundários."""
    hastes.append((P, 1.5 if profundidade == 0 else 1.1))
    t = .08; lado = 1
    while t < .96:
        x, y = bezier(P, t); a = direcao(P, t)
        lados = [1, -1] if rng.random() < .32 else [lado]
        for sd in lados:
            ang = a + sd*rng.uniform(30, 54) + rng.uniform(-5, 5)
            comp = lerp(c0, c1, t) * rng.uniform(.82, 1.2)
            folhas.append((x, y, ang, comp, rng.uniform(.9, 1.25), sortear_tom(rng), rng.choice('ABC')))
        lado *= -1
        t += rng.uniform(.034, .058)
    x, y = bezier(P, 1); a = direcao(P, 1)
    folhas.append((x, y, a + rng.uniform(-8, 8), c1*1.15, 1.1, sortear_tom(rng), 'A'))
    if profundidade == 0:
        for (tt, sd, frac) in galhos:
            x, y = bezier(P, tt); a = direcao(P, tt) + sd*rng.uniform(32, 46)
            comp = frac * math.dist(P[0], P[3]); r = math.radians(a)
            ex, ey = x + math.cos(r)*comp, y + math.sin(r)*comp
            curva = math.radians(a - sd*rng.uniform(15, 30))
            Q = [(x, y), (x + math.cos(r)*comp*.35, y + math.sin(r)*comp*.35),
                 (ex - math.cos(curva)*comp*.3, ey - math.sin(curva)*comp*.3), (ex, ey)]
            crescer(rng, Q, lerp(c0, c1, tt)*.82, c1*.8, 1, [], hastes, folhas)


def desenhar(d):
    sfx = d['sufixo']
    rng = random.Random(d['semente']); hastes = []; folhas = []
    for P, c0, c1, galhos in d['ramos']:
        crescer(rng, P, c0, c1, 0, galhos, hastes, folhas)

    def usar(f):
        return (f'<use href="#lf{f[6]}{sfx}" transform="translate({f[0]:.1f} {f[1]:.1f}) rotate({f[2]:.0f}) '
                f'scale({f[3]/30:.2f} {f[3]/30*f[4]:.2f})"/>')

    defs = ''.join(f'<g id="lf{k}{sfx}"><path d="{p}"/><path d="M1 0 L27 0" fill="none" stroke-width=".3"/></g>'
                   for k, p in FORMAS.items())
    defs += (f'<filter id="wc{sfx}" x="-10%" y="-10%" width="120%" height="120%">'
             '<feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="2" seed="5" result="w"/>'
             '<feDisplacementMap in="SourceGraphic" in2="w" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="d"/>'
             '<feGaussianBlur in="d" stdDeviation=".35"/></filter>'
             f'<filter id="sf{sfx}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.5"/></filter>')

    partes = [f'<svg viewBox="{d["caixa"]}" xmlns="http://www.w3.org/2000/svg"><defs>{defs}</defs>']
    # sombra no papel
    partes.append('<g class="tint" style="--d:0.00s"><g fill="rgb(70,48,28)" opacity=".10" filter="url(#sf%s)" '
                  'transform="translate(10 12)">' % sfx + ''.join(usar(f) for f in folhas) + '</g></g>')
    # hastes (desenhadas com traço que "cresce")
    tracos = ''.join(
        f'<path pathLength="1" style="--d:{i*ATRASO_HASTE:.2f}s" stroke-width="{w}" '
        f'd="M{P[0][0]:.0f} {P[0][1]:.0f} C{P[1][0]:.0f} {P[1][1]:.0f} {P[2][0]:.0f} {P[2][1]:.0f} {P[3][0]:.0f} {P[3][1]:.0f}"/>'
        for i, (P, w) in enumerate(hastes))
    partes.append(f'<g class="draw" fill="none" stroke="{COR_HASTE}" stroke-linecap="round">{tracos}</g>')
    # folhas, por tom (aquarela: tons se sobrepõem em multiplicação)
    for i, nome in enumerate(['luz', 'media', 'fria', 'escura']):
        preench, contorno = TONS[nome]
        grupo = [f for f in folhas if f[5] == nome]
        partes.append(f'<g class="tint" style="--d:{ATRASO_FOLHAS + i*PASSO_FOLHAS:.2f}s;mix-blend-mode:multiply">'
                      f'<g fill="{preench}" fill-opacity=".86" stroke="{contorno}" stroke-opacity=".55" '
                      f'stroke-width=".55" filter="url(#wc{sfx})">' + ''.join(usar(f) for f in grupo) + '</g></g>')
    partes.append('</svg>')
    return ''.join(partes), len(folhas), len(hastes)


def main():
    topo, n1, h1 = desenhar(TOPO)
    fim, n2, h2 = desenhar(FIM)
    quebrar = lambda svg: svg.replace('><', '>\n<')   # um elemento por linha, só para ficar legível
    js = f'''/* ==========================================================================
   Ramos de oliveira (topo e fim da página)

   ARQUIVO GERADO por tools/gerar-ramos.py — não edite à mão (as alterações se perdem).
   Para mudar o desenho, ajuste os números no começo de tools/gerar-ramos.py e rode:
       python3 tools/gerar-ramos.py

   Cada desenho é inserido no elemento de index.html marcado com data-ramos="topo" ou "fim".
   A aparência (posição, tamanho) está em assets/css/ramos.css e a animação em assets/css/animacoes.css.
   ========================================================================== */
(function () {{
  var DESENHOS = {{
    topo: `{quebrar(topo)}`,
    fim: `{quebrar(fim)}`
  }};
  Object.keys(DESENHOS).forEach(function (nome) {{
    var alvo = document.querySelector('[data-ramos="' + nome + '"]');
    if (alvo) {{ alvo.innerHTML = DESENHOS[nome]; }}
  }});
}})();
'''
    with open(SAIDA, 'w', encoding='utf-8') as f: f.write(js)
    print(f'ramos.js gerado: topo = {n1} folhas e {h1} hastes | fim = {n2} folhas e {h2} hastes')


if __name__ == '__main__':
    main()
