# Site pessoal de Gabriel Sousa

Blog e portfólio acadêmico/profissional: página inicial, posts, pesquisa, projetos e CV.
O site é estático (só HTML, CSS e um mínimo de JavaScript), feito com [Astro](https://astro.build) 7. Não tem banco de dados nem servidor para manter.

- **Publicar na internet:** [docs/PUBLICAR.md](docs/PUBLICAR.md)
- **Publicar com um agente de coding (passo a passo, do repositório ao deploy):** [docs/PUBLICAR-COM-AGENTE.md](docs/PUBLICAR-COM-AGENTE.md)
- **O que revisar antes de publicar:** [docs/ANTES-DE-PUBLICAR.md](docs/ANTES-DE-PUBLICAR.md)
- **Blogs de referência, escolha do framework e da hospedagem, plano de conteúdo:** [docs/REFERENCIAS.md](docs/REFERENCIAS.md)

## Rodar no seu computador

Você precisa do [Node.js](https://nodejs.org) 22.23.4 ou mais novo (a versão 24 LTS serve).

```bash
npm install        # só na primeira vez
npm run dev        # abre em http://localhost:4321 e atualiza a cada alteração
```

`npm run dev` mostra também os rascunhos. Para ver o site exatamente como vai ao ar:

```bash
npm run build      # gera a pasta dist/
npm run preview    # serve a pasta dist/
```

## Onde editar

O conteúdo está separado do código. Posts são arquivos Markdown; todo o resto está em arquivos de dados com comentários explicando cada campo.

| Para mudar | Edite |
| --- | --- |
| Nome, frase grande da página inicial, linha de cargo, texto "About", links, e-mail | `src/data/profile.ts` |
| Experiência, formação, certificações, prêmios, idiomas | `src/data/cv.ts` |
| Projetos de pesquisa (mestrado, iniciação científica) | `src/data/research.ts` |
| Projetos aplicados (PetroNeMo, CAM etc.); os marcados com `featured: true` aparecem na inicial | `src/data/projects.ts` |
| Publicações | `src/data/publications.ts` |
| Banner de novidades: avaliações, palestras e outros anúncios | `src/data/news.ts` |
| Posts | `src/content/writing/*.md` |
| Foto | `public/1649783605466.jpg`; enquadramento em `.portrait`, no arquivo `src/styles/global.css` |
| Cores dos temas escuro e claro, tipografia | início de `src/styles/global.css` |
| Itens do menu | `src/components/Header.astro` |
| Imagem que aparece ao compartilhar links | `public/og.png` (1200 × 630) |
| Estatísticas de visitas (desligadas) | `src/components/Analytics.astro` |

Seções vazias somem sozinhas: sem publicações cadastradas, a página Research aponta para o Lattes; sem projetos, o item "Projects" sai do menu.

## Home updates banner

The home page shows five expandable previews. Hover, click, tap or use the keyboard to expand a card; its link opens the full entry. All website copy should be written in English.

- **Posts:** included automatically, sorted by `updatedDate` or `pubDate`. Drafts are excluded. Optional frontmatter fields: `shortTitle`, `image` (for example `/masters-thesis.jpeg`) and `imageAlt`.
- **Projects and certifications:** add `addedDate: 'YYYY-MM-DD'` to the entry in `src/data/projects.ts` or `src/data/cv.ts` to include it chronologically. This is the date added to the site, not the start of a project or a credential's issue date. The same optional preview fields are supported; certifications can also have a `summary`.
- **Other updates:** add a dated entry to `src/data/news.ts` with `title`, `text`, `category` (for example `Evaluation`), and a `link`. Images and short titles are optional.

Entries with dates appear first, newest first. One existing project and certification without dates can fill the remaining slots; no dates are inferred. Run `npm test` to verify the feed logic.

## Escrever um post

1. Copie `docs/post-template.md` para `src/content/writing/` e renomeie. O nome do arquivo vira o endereço: `meu-post.md` é publicado em `/writing/meu-post/`.
2. Preencha o cabeçalho:

   ```yaml
   ---
   title: Post title
   description: One or two sentences for lists, search results and link previews.
   pubDate: 2026-12-01
   kind: article        # ou note, para textos curtos
   tags: [LLMs, Evaluation]
   draft: true          # apague esta linha para publicar
   ---
   ```

3. Escreva em Markdown. O modelo mostra tudo o que o site sabe renderizar: fórmulas em LaTeX (`$...$` e `$$...$$`), código com realce, tabelas, notas de rodapé, figuras com legenda e blocos de observação.
4. Rascunhos (`draft: true`) aparecem só em `npm run dev`. Tire a linha e envie para o GitHub: o post vai ao ar em um ou dois minutos.

Cada post ganha sozinho tempo de leitura, sumário lateral, bloco "Cite this post" com BibTeX, entrada no RSS, no sitemap e em `/llms.txt`.

O exemplo de autoria fica em `docs/post-template.md`, fora da coleção publicada. As keywords de cada post aparecem no arquivo Writing e permitem filtrar o histórico.

## Estrutura

```text
.
├── .github/workflows/deploy.yml   publicação automática no GitHub Pages
├── astro.config.mjs               configuração: endereço, Markdown, fontes
├── docs/                          guias em português
├── public/                        arquivos servidos como estão (favicon, og.png)
└── src/
    ├── assets/                    foto e fontes
    ├── components/                cabeçalho, rodapé, listas
    ├── content/writing/           posts em Markdown
    ├── data/                      perfil, CV, pesquisa, projetos, publicações
    ├── layouts/                   moldura das páginas e dos posts
    ├── lib/                       funções auxiliares (datas, links, posts)
    ├── pages/                     uma página por arquivo, mais RSS, robots e llms.txt
    └── styles/global.css          todo o visual do site
```

## Manutenção

O projeto tem oito dependências e nenhuma configuração fora de `astro.config.mjs`.

- **Atualizar o Astro:** `npx @astrojs/upgrade`, depois `npm run build` para conferir.
- **Fórmulas:** o Markdown usa o processador `unified` do Astro com `remark-math` e `rehype-katex`. A versão do pacote `katex` precisa acompanhar a que o `rehype-katex` usa (hoje, 0.16.x); se forem diferentes, as fórmulas perdem os índices e expoentes. Ao atualizar, rode `npm ls katex` e confira que aparece uma versão só.
- **Tema:** o site abre no tema claro. A escolha feita pelo botão do menu fica salva nas visitas seguintes. O padrão é definido em `src/layouts/Base.astro` e no script de `src/components/BaseHead.astro`; as cores estão em `src/styles/global.css`.
- **Figuras:** os gráficos dos posts têm fundo branco e ficam legíveis nos temas claro e escuro. Diagramas em SVG colados direto no post, com `class="diagram"` e `currentColor`, acompanham a cor do tema.
- **Fontes:** ficam em `src/assets/fonts`, hospedadas pelo próprio site, com as licenças ao lado.

## O que foi testado

- `npm ci`, `npm test` e `npm run build` em Node 22.23.5: 32 páginas geradas, sem erros.
- Build com o site na raiz e em subpasta (`BASE_PATH`), conferindo links canônicos e prefixos.
- Todos os links internos e imagens das páginas geradas apontam para arquivos existentes.

O workflow do GitHub Pages usa as versões atuais das actions oficiais (`actions/checkout@v7`, `actions/configure-pages@v6`, `withastro/action@v6`, `actions/deploy-pages@v5`). Ele só roda dentro do GitHub: a primeira execução acontece quando o código for enviado.

## Publicação por agente — configuração local

Esta cópia revisada usa `.env.publish` (ignorado pelo Git) para os placeholders de conta, token e identidade dos commits. Preencha-o e execute `npm run publish:check`. O roteiro completo está em [docs/PUBLICAR-COM-AGENTE.md](docs/PUBLICAR-COM-AGENTE.md), e a revisão em [docs/REVISAO-PUBLICACAO.md](docs/REVISAO-PUBLICACAO.md).
