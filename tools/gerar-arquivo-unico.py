#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Junta o site inteiro em UM único arquivo HTML (CSS, JavaScript e monograma embutidos).

Uso (na raiz do projeto):   python3 tools/gerar-arquivo-unico.py
Resultado:                  dist/convite-arquivo-unico.html

Serve para hospedagens que aceitam um único arquivo, ou para enviar o convite por e-mail/anexo.
Para publicar normalmente, use a pasta inteira (veja docs/publicar.md): fica mais leve e mais fácil de editar.
"""
import base64, os, re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ler = lambda caminho: open(os.path.join(RAIZ, caminho), encoding='utf-8').read()

html = ler('index.html')

# CSS: cada <link rel="stylesheet" href="assets/css/..."> vira um <style> (mesma ordem)
def trocar_css(m):
    return '<style>\n' + ler(m.group(1)).strip() + '\n</style>'
html = re.sub(r'<link rel="stylesheet" href="(assets/css/[^"]+)">', trocar_css, html)

# JavaScript: os <script src defer> viram um bloco no fim da página (mesma ordem)
scripts = re.findall(r'<script src="(assets/js/[^"]+)" defer></script>\n?', html)
html = re.sub(r'<script src="assets/js/[^"]+" defer></script>\n?', '', html)
bloco = '\n'.join('<script>\n' + ler(s).strip() + '\n</script>' for s in scripts)
html = html.replace('</body>', bloco + '\n</body>')

# Imagens: viram dados dentro do HTML
def trocar_img(m):
    caminho = m.group(1)
    dados = base64.b64encode(open(os.path.join(RAIZ, caminho), 'rb').read()).decode()
    tipo = 'image/webp' if caminho.endswith('.webp') else 'image/png'
    return f'src="data:{tipo};base64,{dados}"'
html = re.sub(r'src="(assets/img/[^"]+)"', trocar_img, html)

os.makedirs(os.path.join(RAIZ, 'dist'), exist_ok=True)
saida = os.path.join(RAIZ, 'dist', 'convite-arquivo-unico.html')
open(saida, 'w', encoding='utf-8').write(html)
print(f'Gerado: dist/convite-arquivo-unico.html ({len(html)//1024} KB)')
