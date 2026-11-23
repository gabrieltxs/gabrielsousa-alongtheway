# Publicação autônoma no GitHub Pages

Esta cópia foi preparada para a conta pessoal informada em `.env.publish`, em um repositório público com branch `main`. Não exige domínio próprio, senha do GitHub nem token dentro do workflow. O agente usa o PAT local para configurar o repositório e enviar o código; o GitHub Actions usa seu próprio `GITHUB_TOKEN`/OIDC para publicar.

## 1. O que preencher

Edite **`.env.publish` na raiz do projeto**, criado com permissão `600`:

| Campo | Valor |
| --- | --- |
| `GITHUB_USER` | Seu login do GitHub, sem `@`, proprietário do repositório. |
| `GITHUB_REPO` | Deixe vazio para usar `SEU_USUARIO.github.io`; outro nome gera uma URL em subpasta. |
| `GH_TOKEN` | Seu personal access token, criado no GitHub. |
| `GIT_AUTHOR_NAME` | Nome público dos commits, já preenchido como Gabriel Sousa. |
| `GIT_AUTHOR_EMAIL` | E-mail dos commits. Pode usar o endereço noreply exibido em GitHub > Settings > Emails. |

Não envie o token no chat. Não use prefixo `PUBLIC_` para segredos. Não faça `source .env.publish`: o helper lê o arquivo como dados, sem executar shell. O modelo recuperável está em `docs/publicacao.env.example`. `.gitignore` ignora todos os `.env*`; nunca inclua o arquivo preenchido em um ZIP compartilhado.

`SITE_URL`, `BASE_PATH`, URL pública e identidade do committer são calculados automaticamente. Não é necessário preencher esses campos. O helper nesta revisão suporta o domínio padrão github.io; domínio próprio exige configurar Pages/DNS e revisar a validação local antes da publicação.

## 2. Token e permissões

Crie o token em **GitHub > Settings > Developer settings > Personal access tokens**. Defina uma expiração compatível com o período de publicação.

**Fine-grained PAT:** selecione sua conta como Resource owner e permita:

| Repository permission | Acesso |
| --- | --- |
| Contents | Read and write — enviar código |
| Workflows | Read and write — enviar `.github/workflows/deploy.yml` |
| Administration | Read and write — criar/configurar repositório e Pages |
| Pages | Read and write — configurar publicação |
| Actions | Read and write — consultar/disparar runs |
| Metadata | Read — normalmente incluído automaticamente |

Para limitar o token a um repositório, crie primeiro um repositório público **vazio**, sem README, licença nem gitignore, e selecione somente ele. Para o agente criar o repositório do zero, a seleção precisa cobrir o novo repositório (All repositories), com Administration write; esse acesso é mais amplo.

**Alternativa para conta pessoal:** PAT classic com `public_repo` e `workflow`. Esses escopos atendem ao fluxo de repositório público, mas alcançam outros repositórios públicos acessíveis pela conta. Não é necessário `delete_repo`, nem o escopo amplo `repo` para este projeto público.

O token só concede permissões que sua conta já tem. Políticas de organização, aprovação de tokens, proteção de branch ou revisão obrigatória do ambiente podem exigir intervenção do administrador. Não desative essas regras automaticamente. O fluxo proposto usa conta pessoal e repo novo/vazio para evitar esses bloqueios.

Fontes: [criação de repositórios](https://docs.github.com/en/rest/repos/repos#create-a-repository-for-the-authenticated-user), [permissões de Pages](https://docs.github.com/en/rest/pages/pages), [escopos de tokens](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps), [GH_TOKEN no GitHub CLI](https://cli.github.com/manual/gh_auth_login).

## 3. Ferramentas e verificação local

Pré-requisitos: Git, Node.js 24.22.3 (versão usada na revisão), npm e GitHub CLI `gh` 2.x no PATH. O `gh` pode ser instalado seguindo https://cli.github.com/; não é preciso executar login interativo quando `GH_TOKEN` está configurado. Nesta máquina o runtime Node está em `../../.runtime/node-v24.22.3-linux-x64/bin`, relativo à raiz desta cópia extraída; `gh` ainda precisa ser instalado ou disponibilizado no PATH.

Na raiz que contém `package.json`:

```bash
npm run publish:check
# Valida placeholders e destino localmente; não faz chamadas remotas nem revela o token.

# Em uma sessão Bash, este atalho transmite o token só pelo ambiente do subprocesso.
pub() { node scripts/publish-env.mjs "$@"; }
SITE_OWNER="$(pub --get GITHUB_USER)"
SITE_NAME="$(pub --get GITHUB_REPO)"
SITE_REPO="$(pub --get REPOSITORY)"
SITE_ADDRESS="$(pub --get SITE_PUBLIC_URL)"

pub gh api user --jq .login
# O login retornado precisa corresponder a SITE_OWNER. Caso contrário, pare.

pub npm ci
pub npm test
pub npm run build
# Opcional, com Python 3 disponível:
python3 scripts/check-built-links.py
```

Ao mudar `BASE_PATH` ou o processador Markdown, reinstale com `npm ci` antes de reconstruir: o cache de conteúdo do Astro pode manter URLs do build anterior.

O helper retira tokens do ambiente dos subprocessos npm/npx. O build deve produzir `dist/index.html`, `dist/cv/index.html`, sete posts e os recursos locais. Confira o canonical e os prefixos com `SITE_ADDRESS`. Não publique um build com `example.com` no canonical. `.env.publish` não é lido automaticamente por `npm run build` sem o helper.

## 4. Destino e Git

Executar apenas quando o usuário pedir **publicar**. O pedido de preparar arquivos, por si só, não faz operações remotas.

- Não alterar conteúdo em `src/` ou `public/`, nem enviar `editorial/` ou `input-posts/`.
- Nunca force-push, apague arquivos remotos ou substitua um site existente sem autorização específica.
- Consulte `pub gh api "repos/$SITE_REPO"`. Apenas um 404 compatível com ausência permite criar; 401, 403 e erros de rede são falhas de autenticação/permissão/conectividade, não indicação para criar.
- Se o repositório existir, consulte commits: 409 indica repo vazio; havendo histórico, pare e explique a colisão antes de integrar este ZIP.
- Quando ausente e autorizado, crie vazio:

```bash
pub gh api user/repos --method POST -f name="$SITE_NAME" -F private=false -F auto_init=false \
  -f description="Personal site and research blog of Gabriel Sousa" -f homepage="$SITE_ADDRESS"
```

Depois de validar o destino, inicialize esta pasta se ainda não tiver `.git`:

```bash
git init -b main
git remote add origin "https://github.com/$SITE_REPO.git"
git config --local credential.https://github.com.helper ''
git config --local --add credential.https://github.com.helper '!gh auth git-credential'
git add .
git diff --cached --name-only
```

Confira que o stage não contém `.env*`, `node_modules/`, `dist/` ou `.astro/`. O modelo `docs/publicacao.env.example` contém apenas placeholders e pode ser versionado. Não exiba o conteúdo de arquivos secretos, `env`, `gh auth token`, nem a saída do credential helper. A URL remota nunca deve conter token.

```bash
pub git commit -m "Publish personal site"
```

## 5. Pages, push e acompanhamento

Consulte `pub gh api "repos/$SITE_REPO/pages"`. Se não estiver configurado, crie; se existir com outra fonte, atualize somente o campo `build_type`:

```bash
# Criar, somente quando ainda não existe:
pub gh api --method POST "repos/$SITE_REPO/pages" -f build_type=workflow
# Atualizar uma configuração já existente, em vez do POST:
pub gh api --method PUT "repos/$SITE_REPO/pages" -f build_type=workflow
```

Não use POST || PUT indiscriminadamente: erros de permissão não se resolvem assim. Confirme `build_type=workflow`. Se a criação de Pages recusar um repo vazio, faça o primeiro push, configure Pages e dispare o workflow manualmente depois.

```bash
pub git push -u origin main
# Se o primeiro run começou antes de Pages estar configurado:
pub gh workflow run deploy.yml --repo "$SITE_REPO" --ref main
```

O workflow já usa as versões existentes das actions e Node 24.22.3. Ele lê origem/subpasta de Pages, instala e compila, executa `npm test` e só publica se tudo passar. Não coloque seu PAT em Secrets do Actions: o workflow não precisa dele. [Como o workflow de Pages autentica](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Acompanhe **o commit enviado**, não um run antigo:

```bash
SITE_COMMIT="$(git rev-parse HEAD)"
pub gh run list --repo "$SITE_REPO" --workflow deploy.yml --commit "$SITE_COMMIT" \
  --json databaseId,status,conclusion,headSha,url
# Escolha o databaseId correspondente ao commit e ao disparo atual:
pub gh run view RUN_ID --repo "$SITE_REPO" --json status,conclusion,headSha,url
```

Substitua `RUN_ID` pelo ID obtido. Repita a consulta com intervalo de 10–20 segundos até `completed`; exija `conclusion=success`. Em falha, consulte `--log-failed` e corrija apenas configuração dentro do escopo. Use polling de `gh run view`: [`gh run watch` não aceita fine-grained PAT atualmente](https://cli.github.com/manual/gh_run_watch).

## 6. Verificação final

Obtenha a URL final com `pub gh api "repos/$SITE_REPO/pages" --jq .html_url`. Confira, com prefixo da subpasta quando houver:

- HTTP 200 na home, `/writing/`, `/research/`, `/projects/`, `/cv/`, RSS, sitemap e nos sete posts.
- HTTP 200 para CSS, fontes, imagens e `/documents/system-one-literature-review.pdf`.
- HTTP 404 em um caminho inexistente.
- Canonical/RSS/sitemap com o domínio real, sem `example.com`.
- Em navegador: tema claro inicial, cabeçalho uniforme, banners principais fixos na home, ausência dos mini banners/Go to top na home, botão de e-mail no CV e controles nos posts.

A primeira publicação pode precisar de alguns minutos de propagação. Informe URL do site/repo, commit, run e verificações. Não declare publicado antes da confirmação.

## Pedido pronto para o agente

> Publique este site no GitHub Pages seguindo docs/PUBLICAR-COM-AGENTE.md. As configurações estão em .env.publish; use scripts/publish-env.mjs sem exibir o token. Autorizo criar um repositório público novo ou usar o destino vazio configurado, configurar Pages, enviar esta versão e verificar o deploy. Não substitua um repositório com histórico, não use force-push e não altere o conteúdo do site.
