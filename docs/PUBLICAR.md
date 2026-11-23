# Publicar o site

> Vai usar um agente de coding? O roteiro completo e executável, da criação do repositório à verificação do site no ar, está em [PUBLICAR-COM-AGENTE.md](PUBLICAR-COM-AGENTE.md).

Recomendação: **GitHub Pages** para hospedar e um domínio **.com.br** no Registro.br.

| Item | Custo |
| --- | --- |
| Hospedagem no GitHub Pages | R$ 0 |
| Certificado HTTPS | R$ 0 (incluído) |
| Domínio `.com.br` no Registro.br | R$ 40 por ano (opcional) |

Sem domínio próprio, o site fica em `https://SEU-USUARIO.github.io` e o custo é zero. As outras opções de hospedagem e o motivo da escolha estão em [REFERENCIAS.md](REFERENCIAS.md).

## 1. Colocar o código no GitHub

1. Crie uma conta em [github.com](https://github.com), se ainda não tiver.
2. Crie um repositório **público** chamado `SEU-USUARIO.github.io` (troque pelo seu nome de usuário). Com esse nome, o site fica na raiz do endereço. Não marque nenhuma opção de arquivo inicial.

   Qualquer outro nome de repositório também funciona; nesse caso o endereço vira `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/` e o projeto se ajusta sozinho.

3. Na pasta do projeto, no terminal:

   ```bash
   git init
   git add .
   git commit -m "Primeira versão do site"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-USUARIO.github.io.git
   git push -u origin main
   ```

No plano gratuito do GitHub, o Pages exige repositório público. Isso significa que o código e os arquivos de dados ficam visíveis: não coloque neles nada que não possa ser público.

## 2. Ligar o GitHub Pages

1. No repositório, abra **Settings > Pages**.
2. Em **Source**, escolha **GitHub Actions**.
3. Abra a aba **Actions**. O workflow "Deploy to GitHub Pages" roda sozinho a cada envio para `main`; se não tiver começado, clique nele e em **Run workflow**.
4. Em um ou dois minutos o endereço aparece no fim da execução e em **Settings > Pages**.

Daí em diante, publicar é só enviar as alterações:

```bash
git add .
git commit -m "Novo post"
git push
```

Você não precisa editar o endereço do site em nenhum arquivo: o workflow lê o endereço das configurações do Pages (inclusive o domínio próprio, depois que você configurar).

## 3. Domínio próprio (opcional, recomendado)

Um domínio seu deixa o endereço independente do GitHub: se um dia você mudar de hospedagem, os links continuam valendo.

1. Registre o domínio em [registro.br](https://registro.br) (por exemplo `seunome.com.br`). O `.dev` e o `.com` são alternativas; veja os preços em [REFERENCIAS.md](REFERENCIAS.md).
2. No GitHub, em **Settings > Pages > Custom domain**, digite o domínio (sem `www`) e salve.
3. No painel de DNS do Registro.br, crie os registros abaixo.

   | Tipo | Nome | Valor |
   | --- | --- | --- |
   | A | (o próprio domínio) | `185.199.108.153` |
   | A | (o próprio domínio) | `185.199.109.153` |
   | A | (o próprio domínio) | `185.199.110.153` |
   | A | (o próprio domínio) | `185.199.111.153` |
   | CNAME | `www` | `SEU-USUARIO.github.io` |

   Confira os endereços na [documentação do GitHub](https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) antes de salvar; eles mudam raramente, mas mudam.

4. Espere a propagação do DNS (de minutos a algumas horas). Quando o GitHub confirmar o domínio, marque **Enforce HTTPS**.
5. Rode o workflow mais uma vez (**Actions > Deploy to GitHub Pages > Run workflow**) para o sitemap, o RSS e os links canônicos passarem a usar o domínio novo.

Como a publicação é feita por workflow, o GitHub não exige o arquivo `CNAME` no repositório.

## 4. Fazer o site ser encontrado

O site já sai com sitemap, RSS, metadados para Google e para prévias de link, dados estruturados de pessoa (schema.org) e `/llms.txt`. O que falta depende de você:

1. **Google Search Console** ([search.google.com/search-console](https://search.google.com/search-console)): adicione o domínio e envie `https://SEU-DOMINIO/sitemap-index.xml`. Faça o mesmo no Bing Webmaster Tools.
2. **Aponte seus perfis para o site.** É o que mais ajuda o Google a entender que o site é seu: LinkedIn (campo "Site" e seção "Em destaque"), Lattes, GitHub, Hugging Face, ORCID e Google Scholar (campo "Página inicial").
3. **Preencha os links de volta** em `src/data/profile.ts` (GitHub, Scholar, ORCID). Eles aparecem no rodapé de todas as páginas.
4. **A cada post**, publique um resumo de três ou quatro linhas no LinkedIn com o link para o site. O texto completo fica no seu domínio; a rede social só leva o leitor até ele.
5. **Estatísticas** (opcional): veja as instruções em `src/components/Analytics.astro`.

## Alternativa: Cloudflare

Se você preferir manter o repositório privado, a Cloudflare hospeda sites estáticos de graça, sem limite de tráfego. Conecte o repositório no painel, use `npm run build` como comando e `dist` como pasta de saída, e defina a variável de ambiente `SITE_URL` com o endereço final do site. O arquivo `.github/workflows/deploy.yml` pode ser apagado nesse caso.

## Problemas comuns

| Sintoma | Causa provável |
| --- | --- |
| A página abre sem estilo | O site está em subpasta e foi construído sem `BASE_PATH`. Publique pelo workflow, que cuida disso. |
| O workflow falha em "Install" | O arquivo `package-lock.json` não foi enviado. Ele precisa estar no repositório. |
| O domínio abre, mas sem cadeado | O certificado ainda está sendo emitido. Espere e marque **Enforce HTTPS**. |
| Um post não aparece | Ele ainda tem `draft: true` no cabeçalho. |
