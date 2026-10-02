# Artes Mamãe Mundo Criar — Papelaria e Personalizados

Site da **Artes Mamãe Mundo Criar**, com produtos personalizados, serviços de papelaria e impressão, preços de bottons e contato pelo WhatsApp e Instagram.

## Publicação

Site disponível localmente em `index.html`. A URL pública está pendente: esta pasta não tinha repositório Git nem um repositório correspondente no GitHub na consulta inicial. A criação do repositório remoto e a publicação dependem da definição de nome e visibilidade pelo usuário, conforme `../CLAUDE.md`.

## Tecnologias

HTML, CSS e JavaScript puros, sem ferramentas de build ou dependências de execução. Fontes Fredoka e Nunito Sans pelo Google Fonts, com alternativas locais. Ícones e ilustrações em SVG no HTML.

## Estrutura

- `index.html`: conteúdo, navegação, produtos, catálogo e contato.
- `styles.css`: identidade visual e layouts responsivos.
- `script.js`: menu mobile, ampliação acessível do catálogo e entradas discretas ao rolar.
- `img/`: logo e materiais originais da marca.

## Revisão visual

Redesign preparado na branch local `feat/redesign-papelaria`. A versão original está preservada na `main`.

Os bottons exibidos usam exemplos do catálogo original. As canecas, lembrancinhas e o cupcake são ilustrações vetoriais, identificadas como tal; não representam fotos de pedidos entregues. Valores, telefone e Instagram foram preservados.

Fotos reais, depoimentos autorizados, região atendida e horários podem ser adicionados quando fornecidos pelo cliente. Não há informações inventadas desses tipos.

O layout contém ajustes para celular, tablet e computador. Navegação e catálogo continuam acessíveis sem JavaScript; movimento respeita `prefers-reduced-motion`. A conferência visual no navegador e o Lighthouse permanecem pendentes por bloqueio de acesso a arquivos locais na ferramenta de navegador da sessão.

## Fluxo do projeto

Antes de publicar, definir o repositório remoto, registrar a Issue de melhoria e abrir o Pull Request mencionando essa Issue. Após aprovação e merge, conferir o site publicado em 360 e 412 px, os links de contato e os resultados do Lighthouse. O orçamento e o domínio seguem as confirmações exigidas em `../CLAUDE.md`.
