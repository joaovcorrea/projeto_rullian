# Operações SEO e manutenção (Dr. Rullian Pinheiro)

Este guia cobre o que **não** dá para automatizar no código (Google) e a rotina mínima recomendada.

## 1. Google Search Console (obrigatório na sua conta Google)

1. Acesse [Google Search Console](https://search.google.com/search-console).
2. Adicione a propriedade do domínio canônico do site: `https://www.drrullianpinheiro.com.br/`
3. Complete a **verificação de propriedade** (método recomendado: registro DNS TXT no provedor do domínio, ou arquivo HTML na raiz do site, conforme as instruções do Google).
4. Envie o sitemap: em **Sitemaps**, informe `https://www.drrullianpinheiro.com.br/sitemap.xml`

**Frequência:** após a configuração inicial, revise **1x por mês** (15–30 minutos):
- **Desempenho:** cliques, impressões, consultas principais.
- **Cobertura / Páginas:** erros de indexação, páginas excluídas inesperadas.
- **Experiência / Core Web Vitals:** alertas graves (se aparecerem).

## 2. Pedir indexação após mudanças importantes

Quando publicar alterações relevantes (nova seção, nova página, mudança forte de título/descrição):

1. Search Console → **Inspeção de URL**.
2. Cole a URL exata (ex.: `https://www.drrullianpinheiro.com.br/` ou `.../emergencia.html`).
3. Clique em **Solicitar indexação**.

**Frequência:** só quando houver **mudança significativa**, não a cada ajuste pequeno.

## 3. Verificação local no projeto (automatizada)

No computador, na pasta do projeto:

```bash
npm run health
```

Isso valida links relativos nos HTML e consistência básica com o `sitemap.xml`.

**Frequência:** antes de cada deploy ou **1x ao mês**.

## 4. Links externos e avaliações (revisão manual)

A cada **2–3 meses** (ou quando mudar telefone/endereço):

- Testar WhatsApp, telefone e link do Google Maps no site.
- Conferir se o perfil do **Google Meu Negócio** está alinhado (endereço, horário, telefone).
- Conferir botão “avaliações no Google” e se o link ainda abre o estabelecimento correto.

## 5. Conteúdo extra (opcional, crescimento orgânico)

Não é obrigatório para o site “estar bom”. Vale considerar quando quiser **mais tráfego** em buscas específicas: páginas por especialidade ou por região (texto único em cada uma, sem duplicar).

---

**Resumo:** configure o Search Console uma vez, envie o sitemap, use inspeção de URL quando publicar algo grande, rode `npm run health` periodicamente e revise links/avaliações algumas vezes por ano.
