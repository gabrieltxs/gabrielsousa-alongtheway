# Categorias de Writing

Cada post em `src/content/writing/` precisa de **uma** categoria no frontmatter:

| `category` | Categoria | Foco |
| --- | --- | --- |
| `research-notes` | Research Notes | Literatura, análises, pesquisa em andamento e questões abertas |
| `experiments` | Experiments | Hipóteses, desenho experimental, ablações, benchmarks e resultados |
| `builds` | Builds | Ferramentas, bibliotecas, aplicações e pipelines disponíveis como código |
| `engineering-notes` | Engineering Notes | Viabilização, configuração de ambientes, HPC, nuvem, deploy e operação |
| `milestones` | Milestones | Defesas, apresentações, eventos, publicações e premiações |

Escolha pelo foco do texto. Um relato da defesa é Milestones; a análise dos experimentos da mesma dissertação é Experiments. Keywords (`tags`) continuam transversais e podem ser várias.

A landing `/writing/` apresenta as cinco categorias. O destaque alterna a cada 5 segundos, pausa com hover/foco e tem controle de pausa. Respeita a preferência por movimento reduzido. Em telas estreitas os banners passam de colunas verticais para faixas empilhadas, mantendo as cinco opções na tela. Ela não mostra a timeline nem o rodapé.

Cada categoria tem uma timeline em `/writing/category/<category>/`, com filtros por keyword. Categorias sem posts mostram um estado vazio. Os endereços dos posts, RSS e páginas de tags existentes são preservados. O schema rejeita categorias ausentes ou inválidas no build.

A faixa **Latest writings**, abaixo dos banners, mostra automaticamente os três posts publicados mais recentes, com título curto, categoria e resumo extraído de `plain` (ou `description` quando não houver `plain`), e links diretos para os artigos. Os cards têm altura ampliada e limitam visualmente as linhas do resumo em telas pequenas, sem alterar o texto original. Usa a mesma ordenação de `getPosts()`. Em celulares baixos, as categorias passam para uma grade compacta para manter também os três posts visíveis sem rolagem.
