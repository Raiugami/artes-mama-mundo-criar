# Artes Mamãe Mundo Criar — Papelaria e Personalizados

Site da **Artes Mamãe Mundo Criar**, com produtos personalizados, serviços de papelaria e impressão, preços de bottons e contato pelo WhatsApp e Instagram.

## Publicação

Site disponível localmente em `index.html`. A URL pública está pendente: esta pasta não tinha repositório Git nem um repositório correspondente no GitHub na consulta inicial. A criação do repositório remoto e a publicação dependem da definição de nome e visibilidade pelo usuário, conforme `../CLAUDE.md`.

## Tecnologias

HTML, CSS e JavaScript puros, sem ferramentas de build ou dependências de execução. Fontes Fredoka e Nunito Sans pelo Google Fonts, com alternativas locais. Ícones e ilustrações em SVG no HTML.

## Estrutura

- `index.html`: conteúdo, navegação, produtos, catálogo e contato.
- `styles.css`: identidade visual e layouts responsivos.
- `script.js`: menu mobile, catálogo ampliado, carrossel de produtos, painéis de serviços e movimento opcional.
- `img/`: logo, materiais originais da marca e fotos ilustrativas em WebP.
- `FONTES-IMAGENS.md`: créditos, fontes e licença das fotos.

## Revisão visual

Redesign inicial preparado em `feat/redesign-papelaria`, com aprimoramentos de interação em `feat/interacoes-portfolio`, hero da marca em `feat/hero-logo-animado` e sequência de animações em `feat/efeitos-logo-em-camadas`. A versão original está preservada na `main`.

Os bottons exibidos usam exemplos do catálogo original. A vitrine de presentes e a seção sobre usam fotos ilustrativas do Unsplash, com licença e créditos registrados em `FONTES-IMAGENS.md`. O cupcake é uma ilustração vetorial. As fotos de banco não representam pedidos entregues pela loja. Valores, telefone e Instagram foram preservados.

Fotos reais, depoimentos autorizados, região atendida e horários podem ser adicionados quando fornecidos pelo cliente. Não há informações inventadas desses tipos.

O layout contém ajustes para celular, tablet e computador. Navegação, produtos e catálogo continuam acessíveis sem JavaScript; o carrossel e os painéis são aprimoramentos progressivos.

## Interações inspiradas no portfólio ÚNICO

Referência consultada: https://www.unicoweb.com.br/ (2 de outubro de 2026).

- Vitrine horizontal nativa com rolagem por toque, setas e teclado. Não captura a rolagem vertical da página.
- Painéis de serviço com orientações para pedir, fechamento por Esc e retorno do foco.
- Cursor complementar, barra de progresso e cabeçalho que retorna ao subir ou receber foco.
- Faixa animada com botão de pausa, pausa ao focar e ao passar o mouse; sem animação contínua na ausência de JavaScript.
- `prefers-reduced-motion` desativa os efeitos, inclusive quando a preferência muda durante a visita. Efeitos de ponteiro ficam desativados em dispositivos de toque.
- O movimento usa CSS e JavaScript puros. Não foram adicionados frameworks, rastreadores nem dependências externas de animação.

## Hero com a logo animada

- A própria logo foi separada em camadas por recortes SVG, sem recriar o lettering, alterar a imagem original ou carregar novas imagens.
- As faixas rosa, amarela, verde e azul se desenham em sequência uma vez na entrada, durante cerca de 3,5 segundos. O arco interno amarelo claro acompanha a última faixa; a imagem completa reaparece ao concluir a pintura.
- As nuvens balançam em direções opostas, até oito unidades da arte (cerca de quatro pixels no celular), em ciclos lentos de 13 segundos.
- Os quatro corações pulsam da esquerda para a direita, com 220 ms entre cada um e uma onda a cada seis segundos. O aumento máximo é de 14%, com descanso entre as ondas.
- Uma passagem de luz de 1,1 segundo atravessa somente as duas linhas do nome. Cada passagem termina antes de um novo intervalo de oito segundos; não há animação contínua de brilho. A aquarela e as posições das letras permanecem estáveis.
- No celular, a logo aparece antes do texto do hero. No computador, fica ao lado da apresentação e dos botões de contato.
- O botão de pausa do hero e o da faixa controlam todas as animações juntos. As camadas também param fora da tela, com a aba oculta, na navegação por teclado e durante a abertura de um painel.
- Sem JavaScript ou com movimento reduzido, aparece a logo original estática. A pintura usa um traço SVG animado apenas na entrada; nuvens, corações e reflexo usam `transform` e `opacity`. A máscara do lettering usa um filtro estático de cor, sem desfoque. Não há bibliotecas nem loops de quadros de JavaScript; o brilho é disparado por um temporizador que também respeita as pausas.

Verificações realizadas: sintaxe JavaScript, estrutura HTML, referências e IDs, preços originais, contraste dos principais textos e botões e dimensões das fotos WebP. Os recortes SVG, as fases da pintura, um coração ampliado e o reflexo sobre as letras foram renderizados e inspecionados. A lógica do menu, da galeria, do carrossel, dos três painéis, da pausa sincronizada, da pausa da logo fora da tela e do intervalo do brilho (incluindo o tempo restante ao retomar) passou em cinco cenários com DOM simulado (360, 412 e 1100 px; toque, ponteiro, movimento reduzido e fallbacks). Esses testes não validam a aparência da página nem substituem testes reais no navegador. A conferência visual em 360 e 412 px e o Lighthouse permanecem pendentes por bloqueio de acesso a arquivos locais na ferramenta de navegador da sessão.

## Fluxo do projeto

Antes de publicar, definir o repositório remoto, registrar a Issue de melhoria e abrir o Pull Request mencionando essa Issue. Após aprovação e merge, conferir o site publicado em 360 e 412 px, os links de contato e os resultados do Lighthouse. O orçamento e o domínio seguem as confirmações exigidas em `../CLAUDE.md`.
