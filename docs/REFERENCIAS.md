# Referências e decisões

Pesquisa feita em 22 de novembro de 2026. Preços e limites mudam: confira as fontes no fim antes de decidir.

## 1. Páginas de referência

Li a estrutura e o texto de cada página abaixo. Não foi possível abri-las no navegador do ambiente em que o site foi construído, então o acabamento visual do seu site é desenho próprio, guiado pelos padrões que elas têm em comum.

### Internacionais

| Quem | Página | O que observar |
| --- | --- | --- |
| Andrej Karpathy | [karpathy.ai](https://karpathy.ai/) | Foto, nome e uma frase. A carreira aparece como linha do tempo com anos. A própria página diz que é HTML e CSS puros. |
| Omar Khattab (MIT) | [omarkhattab.com](https://omarkhattab.com/) | Foto ao lado do nome e do cargo, bio em primeira pessoa com as perguntas de pesquisa, projetos abertos em destaque, pesquisa selecionada com o próprio nome realçado, data da última atualização no rodapé. |
| Jim Fan (NVIDIA) | [jimfan.me](https://jimfan.me/) | Foto circular, nome e cargo. Bloco "Featured" com quatro projetos, cada um com botões para artigo e código. Temas claro, escuro e automático. |
| Nathan Lambert | [natolambert.com](https://www.natolambert.com/) | Foto, nome, bio com os termos principais em negrito e uma fileira de links logo abaixo (Papers, Talks, Newsletter, Book). Seções "Recent" e "Popular Posts". |
| Jack Morris | [jxmo.io](https://jxmo.io/) | Foto, nome, bio em primeira pessoa. Pesquisa em quatro itens datados. Menu curto: Home, Research, Code, Blog, Misc. |
| Nicholas Carlini | [nicholas.carlini.com](https://nicholas.carlini.com/) | Menu por tipo de produção (Papers, Talks, Code, Writing). Trabalhos recentes com um parágrafo de resumo cada. |
| Neel Nanda | [neelnanda.io](https://www.neelnanda.io/) | Blog em lista: data, título e uma ou duas frases. "Top Posts" no menu. |
| Sander Dieleman | [sander.ai](https://sander.ai/) | Poucos posts, muito longos (44 a 84 minutos de leitura), com tempo de leitura indicado. |
| Lilian Weng | [lilianweng.github.io](https://lilianweng.github.io/) | Hugo com PaperMod. Posts longos, menu mínimo, data e tempo de leitura. |
| Sebastian Raschka | [sebastianraschka.com](https://sebastianraschka.com/) | Separa "Latest Articles" de "Quick Notes". Publica `llms.txt`. |
| Eugene Yan | [eugeneyan.com](https://eugeneyan.com/) | Hugo. Página "Start Here" por tema, favoritos dos leitores, bloco de citação nos posts. |
| Hamel Husain | [hamel.dev](https://hamel.dev) | Quarto. Notas curtas ao lado de posts longos. |
| Chip Huyen | [huyenchip.com](https://huyenchip.com/) | Textos sobre IA em produção que viraram referência e livros. |

### Nacionais

| Quem | Página | O que observar |
| --- | --- | --- |
| Sandra Avila (Unicamp) | [ic.unicamp.br/~sandra](https://www.ic.unicamp.br/~sandra) | Hugo com o tema Academic. Home, Publications, Team, Teaching, Awards, Contact. |
| Lucas Resck (Cambridge, antes FGV) | [lucasresck.github.io](https://lucasresck.github.io/) | Jekyll com al-folio. Notícias datadas, publicações selecionadas com resumo e BibTeX, CV em PDF, Lattes entre os contatos, data da última atualização. |
| Gabriel Oliveira dos Santos (Unicamp) | [gabrielsantosrv.github.io](https://gabrielsantosrv.github.io) | Hugo com Wowchemy. Home, Experience, Publications, Posts, Awards. |
| Aline Paes (UFF) | [alinepaes.github.io](https://alinepaes.github.io/news) | Jekyll com al-folio. Publications, Projects, Students, Teaching e notícias datadas. |
| Ruan Chaves Rodrigues | [ruanchaves.github.io](https://ruanchaves.github.io/research) | Publicações selecionadas com local, ano e uma frase de resumo. |
| Francielle Vargas (USP) | [franciellevargas.github.io](https://franciellevargas.github.io/) | Bio, prêmios, projetos de pesquisa e "Latest News". |
| Eraldo Fernandes | [eraldoluis.github.io](https://eraldoluis.github.io) | Bio em primeira pessoa que junta indústria e academia. |
| Edresson Casanova (USP, CEIA) | [edresson.github.io](https://edresson.github.io) | Modelo pronto (HTML5 UP). As seções Projects e Publications estão vazias: é o risco de abrir seções que depois não se preenchem. |

### O que essas páginas têm em comum, e o que entrou no seu site

- **Foto, nome e uma frase no topo** (Karpathy, Khattab, Jim Fan, Jack Morris). No seu site: foto, nome, cargo e uma única frase grande.
- **Fileira de links logo abaixo** (Lambert, Khattab). No seu site: CV, LinkedIn, Lattes, e os demais assim que você preencher.
- **Trabalho selecionado antes da lista completa** (o "Featured" de Jim Fan, os projetos de Khattab). No seu site: "Selected work" na página inicial, com os links do PetroNeMo.
- **Primeira pessoa e listas curtas** (Jack Morris, Khattab). O texto "About" caiu para dois parágrafos.
- **Data da última atualização** (Khattab, Lucas Resck). No rodapé, preenchida a cada publicação.
- **Seções vazias envelhecem mal** (Edresson). No seu site, seção sem conteúdo não aparece.
- **Tema escuro e claro** (Jim Fan). No seu site o padrão é o claro, com botão para o escuro.
- **Posts com data, tempo de leitura, sumário e citação** (Lilian Weng, Sander Dieleman, Eugene Yan).
- **Artigos e notas** como formatos separados (Raschka, Hamel).

As páginas nacionais usam quase todas modelos acadêmicos prontos (al-folio, Hugo Academic, Wowchemy). Um desenho próprio, com o trabalho aplicado ao lado da pesquisa, já diferencia.

### Direção visual desta versão

- **Claro por padrão:** fundo de papel, texto de tinta e acento azul-prússia. O tema escuro opcional usa fundo azul-noite, texto claro e acento amarelo-ipê.
- **Duas vozes tipográficas:** Newsreader (serifada) para a frase de abertura, os títulos e o texto dos posts; Geist para menu, listas e CV; Geist Mono para código.
- **Um momento grande por página:** a frase de abertura na inicial, o título nas demais. O resto é pequeno, alinhado e discreto.
- **Estrutura de ficha:** rótulo na margem, conteúdo ao lado, datas à direita, fios finos entre as seções.

## 2. Framework

| Opção | Quem usa | A favor | Contra |
| --- | --- | --- | --- |
| **Astro 7** (escolhido) | Opção mais indicada hoje para blog e portfólio nas comparações de 2026 | Controle total do visual; posts em Markdown; não envia JavaScript por padrão; RSS, sitemap e imagens resolvidos | Depende de Node; de tempos em tempos sai uma versão grande que pede atualização |
| Hugo + PaperMod | Lilian Weng, Eugene Yan (Hugo) | Um único executável, sem dependências; builds instantâneos | Linguagem de templates difícil; site fica com cara de tema |
| Jekyll + al-folio | Aline Paes e boa parte da academia | Tema pronto para acadêmicos, com publicações a partir de BibTeX | Ruby; tema grande, difícil de mudar e de atualizar |
| Quarto | Hamel Husain, fast.ai | Publica notebooks Jupyter direto como post | Visual limitado aos temas; outra ferramenta para instalar |

Por que Astro: você pediu um site com identidade própria e fácil de manter. O projeto ficou com oito dependências, o conteúdo fica em Markdown e em arquivos de dados, e nada de servidor. Se um dia você quiser publicar notebooks direto, o Quarto é a alternativa a considerar; se quiser zero trabalho de design, Hugo com PaperMod.

Uma observação sobre o Astro 7: ele trocou o processador de Markdown padrão por um novo, escrito em Rust (Sätteri), que ainda não roda os plugins de fórmula mais maduros. O projeto usa o processador `unified`, que continua oficial, com `remark-math` e `rehype-katex`.

## 3. Hospedagem

Todas servem para um site estático como este. Valores do plano gratuito.

| Serviço | Preço | Limites | Observações |
| --- | --- | --- | --- |
| **GitHub Pages** (recomendado) | Gratuito | Site de até 1 GB; limite brando de 100 GB de tráfego por mês | Domínio próprio e HTTPS incluídos. No plano gratuito o repositório precisa ser público. É onde vários dos pares hospedam. |
| Cloudflare (Pages / Workers) | Gratuito | Requisições a arquivos estáticos sem limite; 500 builds por mês | Aceita repositório privado. A Cloudflare hoje orienta projetos novos para o Workers com arquivos estáticos; o Pages segue funcionando. |
| Netlify | Gratuito | 300 créditos por mês; ao acabar, os sites pausam até o mês seguinte | Permite uso comercial. |
| Vercel (Hobby) | Gratuito | 100 GB por mês | Só para uso pessoal e não comercial. |

Por que GitHub Pages: custo zero, o código já vai estar no GitHub, a publicação é automática a cada envio e os limites estão muito acima do que um site pessoal usa. O passo a passo está em [PUBLICAR.md](PUBLICAR.md).

### Domínio

| Extensão | Onde | Preço |
| --- | --- | --- |
| `.com.br` | Registro.br | R$ 40 por ano |
| `.com` | Cloudflare Registrar (preço de custo) | cerca de US$ 10,50 por ano |
| `.dev` | vários registradores | cerca de US$ 12 a 15 por ano |

O `.com.br` é o mais barato e passa a mensagem certa para o mercado brasileiro. O `.dev` ou o `.com` fazem mais sentido se o público principal for internacional. Não verifiquei a disponibilidade de nenhum nome.

## 4. Plano de conteúdo

O que dá exposição a um perfil como o seu é texto técnico que só você pode escrever, porque vem do trabalho que você fez. Sugestões tiradas do seu currículo:

**Artigos (um por mês é um bom ritmo)**

1. A série do mestrado: o pipeline de dados jurídicos, os datasets de preferência, a memória híbrida. O post de visão geral já está no site.
2. Adaptação de tokenizador para um modelo de domínio em português: o que muda e como medir.
3. Pré-treino adaptativo de domínio em HPC: curadoria de bilhões de tokens com NeMo Curator.
4. Inferência entre nós para modelos que não cabem na memória de um nó.
5. De SFT a otimização por preferências: como montar um dataset de preferências que presta.
6. Uma arena de modelos para alinhamento: o que o CAM faz e o que aprendemos com feedback de usuários.
7. Como avaliar groundedness e robustez em sistemas de RAG com agentes.

**Notas (quando aparecerem)**

- Um artigo que você leu e o que tirou dele.
- Um problema de Slurm, CUDA ou contêiner que custou uma tarde.
- O rascunho sobre tokenização do português que já está no projeto.

**Destaques (sempre que acontecer algo)**

- Artigo aceito, palestra, certificação, defesa da dissertação. Uma linha em `src/data/news.ts`.

Sobre trabalho para clientes: escreva sobre o método e sobre o que é público (a sessão no GTC, o estudo de caso da Deloitte), não sobre dados ou resultados internos.

## Fontes

Páginas de referência

- Andrej Karpathy: <https://karpathy.ai/>
- Omar Khattab: <https://omarkhattab.com/>
- Jim Fan: <https://jimfan.me/>
- Nathan Lambert: <https://www.natolambert.com/>
- Jack Morris: <https://jxmo.io/>
- Nicholas Carlini: <https://nicholas.carlini.com/>
- Neel Nanda: <https://www.neelnanda.io/>
- Sander Dieleman: <https://sander.ai/>
- Lil'Log: <https://lilianweng.github.io/>
- Sebastian Raschka: <https://sebastianraschka.com/>
- Eugene Yan: <https://eugeneyan.com/>
- Hamel Husain: <https://hamel.dev>
- Chip Huyen: <https://huyenchip.com/>
- Sandra Avila: <https://www.ic.unicamp.br/~sandra>
- Lucas Resck: <https://lucasresck.github.io/>
- Gabriel Oliveira dos Santos: <https://gabrielsantosrv.github.io>
- Aline Paes: <https://alinepaes.github.io/news>
- Ruan Chaves Rodrigues: <https://ruanchaves.github.io/research>
- Francielle Vargas: <https://franciellevargas.github.io/>
- Eraldo Fernandes: <https://eraldoluis.github.io>
- Edresson Casanova: <https://edresson.github.io>
- al-folio: <https://github.com/alshedivat/al-folio>

Framework

- Astro 7, anúncio: <https://astro.build/blog/astro-7/>
- Astro, Markdown e processadores: <https://docs.astro.build/en/guides/content>
- Astro no GitHub Pages: <https://docs.astro.build/en/guides/deploy/github>
- Comparação de geradores em 2026: <https://thesoftwarescout.com/best-static-site-generators-2026-astro-next-js-hugo-more/>
- Por que Quarto: <https://kakeami.github.io/blog/posts/2026-02-why-quarto/index.html>

Hospedagem e domínio

- Limites do GitHub Pages: <https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits>
- Domínio próprio no GitHub Pages: <https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>
- Limites do Cloudflare Pages: <https://developers.cloudflare.com/pages/platform/limits>
- Cloudflare, Pages e Workers: <https://mecanik.dev/en/posts/cloudflare-pages-vs-workers-which-to-use-in-2026/>
- Plano Hobby da Vercel: <https://vercel.com/docs/plans/hobby>
- Netlify e Vercel comparados: <https://agentdeals.dev/vercel-vs-netlify>
- Preço do `.br`: <https://teletime.com.br/14/10/2026/br-6-milhoes/>
- Preços de domínio por registrador: <https://costgoat.com/compare/domains>

Seu trabalho

- Projeto no CEIA-UFG: <https://ceia.ufg.br/geracao-automatica-de-textos-juridicos-utilizando-modelos-de-geradores-de-linguagem-natural/>
- Sessão no NVIDIA GTC 2025: <https://www.nvidia.com/en-us/on-demand/session/gtc25-s73150/>
