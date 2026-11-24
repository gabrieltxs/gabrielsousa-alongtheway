# Revisão da interface — 24 de novembro de 2026

Origem: `portfolio-redesign.zip`, integrado sobre o commit `161c5fb`.

A interface usa a home em formato de cartão, links de perfil com ícones,
efeitos de luz na navegação, cartões de projetos, linha do tempo no CV,
miniaturas e filtros recolhíveis em Writing, além de resumos em linguagem
simples nos sete posts. O corpo dos artigos e os arquivos públicos foram
preservados.

A revisão manteve duas preferências anteriores: tema claro na primeira visita
(com persistência da escolha do visitante) e convite para Writing em verde,
com contraste adaptado ao tema. Foram retirados componentes, dados e estilos
de versões alternativas da home que não eram utilizados. A integração aplica
Ponytail sem adicionar bibliotecas para animação ou interação.

Os símbolos oficiais de GitHub e LinkedIn vêm de Font Awesome Free:
[ícones sob CC BY 4.0](https://fontawesome.com/license/free).

## Validação

- Instalação limpa, testes Node e build estático do Astro.
- Verificação dos links locais, incluindo o prefixo de GitHub Pages.
- Chromium: home em sete larguras, nos dois temas; sete posts com resumos,
  datas, links em nova guia e ausência de transbordamento horizontal.
- Cabeçalho uniforme entre páginas; e-mail oculto no HTML inicial e revelado
  pelo botão do CV, inclusive pelo teclado.
- Todos os filtros de Writing, histórico, recarga e alternativa sem JavaScript.
- Cinco repositórios na aba Repo, links e layout responsivo.
- Mini banners e Go to top: visibilidade conjunta, rotação, teclado,
  clique na imagem expandida e ausência na home.

Os testes de navegador ficam em `tests/*.browser.mjs`. Configure
`PLAYWRIGHT_MODULE` para uma instalação externa do Playwright e
`SITE_TEST_URL` para a URL base (incluindo a subpasta do GitHub Pages).
O navegador de revisão é uma ferramenta externa e não uma dependência do site.
