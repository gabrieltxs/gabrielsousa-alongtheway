# Antes de publicar

O site está pronto para ir ao ar. Esta lista reúne o que só você pode confirmar ou completar; nada aqui impede a publicação.

## Confirmar

- [ ] **O que pode ser público sobre a Deloitte.** O site repete o currículo: o sistema conversacional proprietário, o modelo de 70B comparado ao GPT-4o, o CAM e os projetos para a Petrobras. Um site é indexado pelo Google; vale conferir com a empresa.
- [ ] **PetroNeMo como "o maior modelo de linguagem brasileiro especializado em óleo e gás".** A frase está no resumo do CV (`src/data/cv.ts`) a seu pedido. Tenha uma fonte à mão, porque é o tipo de afirmação que recrutadores conferem.
- [ ] **Posts de pesquisa jurídica.** Publicam resultados agregados de experimentos com CEIA-UFG e CoreJur (nomes de modelos, números, custos). Confirme que o projeto autoriza a divulgação.
- [ ] **Revisão de literatura em PDF** (`public/documents/system-one-literature-review.pdf`). O post sobre System One models aponta para ela como bibliografia completa. O texto do post informa que a revisão foi feita por um revisor com assistência de IA; mantenha essa transparência ou remova o PDF e o link.
- [ ] **Sigla GPO.** Mantida como no currículo, sem expandir.

## Completar

- [ ] **Publicações** (`src/data/publications.ts`). A lista está vazia e a página Research aponta para o Lattes. O artigo de 2020 (primeiro autor, validação léxica e sintática de listas de conectividade de circuitos elétricos) pode entrar com título, coautores e evento exatos. Há um modelo comentado no arquivo.
- [ ] **Links** (`src/data/profile.ts`): GitHub, Google Scholar, ORCID e Hugging Face. Cada um aparece no site assim que for preenchido.
- [ ] **CV em PDF** (opcional): coloque em `public/cv.pdf` e defina `cvPdf: '/cv.pdf'` em `src/data/profile.ts`. Sem isso, a página CV oferece "Print or save as PDF".
- [ ] **Itens do LinkedIn fora do currículo:** a especialização em Banco de Dados com Big Data (UFG) e dois prêmios da PUC Goiás estão comentados em `src/data/cv.ts`. Tire as barras para mostrar.

## Decidir

- [ ] **Domínio próprio.** Veja [PUBLICAR.md](PUBLICAR.md) e o passo 10 de [PUBLICAR-COM-AGENTE.md](PUBLICAR-COM-AGENTE.md).
- [ ] **Anúncios no banner da página inicial** (`src/data/news.ts`). Hoje o banner mostra os posts mais recentes; as entradas sobre o cargo atual e a GTC 2025 estão comentadas e podem voltar.
