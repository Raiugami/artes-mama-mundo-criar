# Artes Mamãe Mundo Criar — Papelaria e Presentes

Site da **Artes Mamãe Mundo Criar**, papelaria e loja de presentes personalizados em Mauá – SP. Cliente: Artes Mamãe Mundo Criar.

**Site publicado:** https://artesmundocriar.imaguiar.com.br

## Sobre o projeto

Site de uma página que apresenta a loja, seus produtos e serviços e leva o visitante ao WhatsApp e ao Instagram. Segue a identidade da marca: aquarela, arco-íris, rosa, amarelo, verde e azul.

Seções principais:

- **Início:** logo animada em camadas, chamada principal e botões de contato.
- **Personalizados:** vitrine em baralho de cartas com ilustrações animadas.
- **Serviços:** impressão e acabamento, papelaria e educação, presentes e acessórios, com preços de referência e passo a passo para pedir.
- **Preços:** montador de botton (tamanho, kit, estampa de exemplo e total), com mensagem pronta para o WhatsApp.
- **Instagram:** perfis `@artesmamaemundocriar` e `@pedacinhodoaamor`, sem exibir o feed.
- **Sobre, Pedacinho do Amor e Como pedir:** história da marca, pilares Criar, Ensinar e Amar e doces de fabricação própria.
- **Avaliações:** nota no Google, mapa que só carrega ao clicar e botão para avaliar.
- **Contato e rodapé:** WhatsApp, Instagram, telefone e endereço.

Valores, telefone e Instagram vêm dos materiais da loja. Fotos reais, depoimentos autorizados e horários completos podem ser adicionados quando forem fornecidos. Não há informações inventadas desses tipos.

## Tecnologias

- HTML, CSS e JavaScript puros, sem build, framework ou dependências de execução.
- Fontes Fredoka e Nunito Sans (Google Fonts), com alternativas locais.
- Ilustrações e ícones em SVG, animações em CSS e `IntersectionObserver`.
- Hospedagem no GitHub Pages, com DNS e HTTPS pela Cloudflare.

## Acessibilidade e desempenho

- `prefers-reduced-motion` desliga os efeitos de movimento.
- As animações só rodam enquanto a seção está visível na tela.
- Sem JavaScript, o conteúdo continua legível: a vitrine vira grade, a tabela de preços fica visível e os links funcionam.
- Imagens com `alt`, WebP e carregamento preguiçoso; o mapa do Google só carrega depois do clique.

## Estrutura de pastas

```
.
├── index.html          conteúdo, SEO e dados estruturados
├── styles.css          identidade visual, layouts e animações
├── script.js           menu, vitrine, montador de botton, avaliações e efeitos
├── CNAME               domínio personalizado do GitHub Pages
├── FONTES-IMAGENS.md   créditos de imagens
└── img/                logo, ícones da guia e materiais da marca
```

## Como ver localmente

```bash
python -m http.server 8000
```

Depois, abra http://localhost:8000.

## Publicação

Todo o conteúdo da branch `main` é publicado pelo GitHub Pages (raiz do repositório). Mudanças entram por Pull Request ligado a uma Issue; o merge é o deploy.
