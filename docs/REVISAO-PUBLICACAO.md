# Revisão da preparação para publicação — 23/11/2026

## Origem e isolamento

ZIP: `gabriel-sousa-site-final-2026-11-23.zip`.
SHA-256: `d94c1b4831d3f77fe15b1e5bf064007cd9e372e3d0d3aa10d2d5c1984adae186`.
Extraído em `personal-page/revisao-publicacao-2026-11-23/gabriel-sousa-site/`.
O ZIP original e o projeto anterior não foram alterados. `src/` e `public/` foram comparados byte a byte com o ZIP; nenhum conteúdo, imagem ou documento foi alterado.

## Achados e correções

1. **Segredos:** o roteiro dizia que `.env*` era ignorado, mas `.gitignore` só listava `.env` e `.env.production`. Corrigido para `.env*`; `.env.publish` tem permissão 600. Modelo versionável em `docs/publicacao.env.example`.
2. **Autenticação:** havia dependência de login interativo e proibição de usar token diretamente. A solicitação atual autoriza um arquivo local; o roteiro/AGENTS foram ajustados. `scripts/publish-env.mjs` lê o arquivo como dados, valida placeholders, calcula URLs, não imprime o token e não o repassa aos subprocessos npm/npx.
3. **Subpasta:** imagens e links escritos como HTML bruto nos posts não recebiam `BASE_PATH`. Corrigido em `astro.config.mjs`, sem editar posts. O cache anterior do Astro precisou ser limpo para reprocessar as páginas.
4. **Publicação:** erros HTTP agora são diferenciados antes de criar repo/configurar Pages. O acompanhamento usa polling do run associado ao commit, evitando `gh run watch` com fine-grained PAT.
5. **CI:** Node fixado em 24.22.3 e `npm test` adicionado antes do job de deploy. As majors originais das actions existem e foram mantidas: checkout v7, configure-pages v6, withastro/action v6, deploy-pages v5.

## Validação executada

- Instalação limpa via `npm ci`, usando o lockfile do ZIP.
- `npm test`: dois testes aprovados (dados dos banners e configuração de publicação).
- `npm run publish:check`: rejeita os placeholders ainda não preenchidos, como esperado.
- Builds com site na raiz e em `/review-site`, ambos aprovados: 32 páginas e sete posts.
- `python3 scripts/check-built-links.py`: 1.269 referências locais verificadas em cada configuração, sem recursos/caminhos ausentes. O canonical especial da página 404 não é tratado como uma rota publicada.
- Regras de ignore verificadas com Git: `.env.publish`, `.env.local`, `.env.production`, dependências, build e cache ficam fora do stage; o modelo com placeholders pode ser versionado.
- Conteúdo de `src/` e `public/` preservado integralmente.

## O que falta para publicar

Preencher `.env.publish` e executar `npm run publish:check`. Git está disponível; Node 24.22.3 está no runtime local indicado no roteiro; `gh` ainda não está no PATH desta máquina. Instalar/disponibilizar GitHub CLI e fornecer acesso de rede ao GitHub são pré-requisitos do ambiente de publicação.

A permissão real do token, a disponibilidade do nome do repositório, as políticas de Actions/Pages e o sucesso remoto só podem ser confirmados após preencher os dados. Não foi feito login, criação remota, push ou deploy. O `dist/` local usa `review-user.github.io` apenas para testar URLs; o agente deve reconstruir com os dados reais pelo helper. O workflow também reconstrói usando as configurações reais do Pages.

## Fontes verificadas

- [GitHub Pages: workflow e permissões](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [API de Pages](https://docs.github.com/en/rest/pages/pages)
- [Criação de repositórios](https://docs.github.com/en/rest/repos/repos#create-a-repository-for-the-authenticated-user)
- [Autenticação do GitHub CLI](https://cli.github.com/manual/gh_auth_login)
- [Limitação de gh run watch](https://cli.github.com/manual/gh_run_watch)
- [checkout](https://github.com/actions/checkout/releases/tag/v7.0.1), [configure-pages](https://github.com/actions/configure-pages/releases/tag/v6.0.0), [Astro action](https://github.com/withastro/action/releases/tag/v6.1.4), [deploy-pages](https://github.com/actions/deploy-pages/releases/tag/v5.0.1)
