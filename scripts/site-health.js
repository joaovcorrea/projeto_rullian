#!/usr/bin/env node
/**
 * Verificacao rapida de saude do site estatico:
 * - links relativos em HTML apontam para arquivos existentes
 * - URLs do sitemap.xml correspondem a arquivos no projeto
 *
 * Uso: node scripts/site-health.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HTML_FILES = ['index.html', 'emergencia.html'].map((f) => path.join(ROOT, f));
const SITEMAP = path.join(ROOT, 'sitemap.xml');

const BASE = 'https://www.drrullianpinheiro.com.br';

function readFileSafe(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

function urlToLocalPath(loc) {
  const u = loc.trim();
  if (!u.startsWith(BASE)) return null;
  const pathname = u.slice(BASE.length) || '/';
  if (pathname === '/' || pathname === '') return path.join(ROOT, 'index.html');
  const clean = pathname.replace(/^\//, '');
  return path.join(ROOT, clean);
}

function collectHrefs(html) {
  const hrefs = new Set();
  const re = /href\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    hrefs.add(m[1].trim());
  }
  return [...hrefs];
}

function isSkippableHref(href) {
  if (!href || href === '#') return true;
  const h = href.split('#')[0];
  if (
    h.startsWith('http://') ||
    h.startsWith('https://') ||
    h.startsWith('//') ||
    h.startsWith('mailto:') ||
    h.startsWith('tel:') ||
    h.startsWith('javascript:')
  ) {
    return true;
  }
  return false;
}

function resolveLocalHref(fromDir, href) {
  const h = href.split('#')[0];
  if (!h) return null;
  return path.normalize(path.join(fromDir, h));
}

let errors = 0;
const messages = [];

function fail(msg) {
  errors += 1;
  messages.push(`ERRO: ${msg}`);
}

function ok(msg) {
  messages.push(`OK: ${msg}`);
}

// 1) HTML interno
for (const htmlPath of HTML_FILES) {
  const dir = path.dirname(htmlPath);
  const name = path.basename(htmlPath);
  const html = readFileSafe(htmlPath);
  if (!html) {
    fail(`Arquivo nao encontrado: ${name}`);
    continue;
  }
  const hrefs = collectHrefs(html);
  for (const href of hrefs) {
    if (isSkippableHref(href)) continue;
    const resolved = resolveLocalHref(dir, href);
    if (!resolved || !resolved.startsWith(ROOT)) {
      fail(`${name}: link suspeito "${href}"`);
      continue;
    }
    if (!fs.existsSync(resolved)) {
      fail(`${name}: link quebrado "${href}" -> ${path.relative(ROOT, resolved)}`);
    }
  }
  ok(`${name}: links relativos verificados (${hrefs.filter((h) => !isSkippableHref(h)).length} locais)`);
}

// 2) Sitemap
const sitemapXml = readFileSafe(SITEMAP);
if (!sitemapXml) {
  fail('sitemap.xml nao encontrado');
} else {
  const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1].trim());
  if (locs.length === 0) {
    fail('sitemap.xml sem <loc>');
  }
  for (const loc of locs) {
    const local = urlToLocalPath(loc);
    if (!local) {
      fail(`sitemap: URL fora do dominio esperado: ${loc}`);
      continue;
    }
    if (!fs.existsSync(local)) {
      fail(`sitemap: arquivo ausente para ${loc} -> ${path.relative(ROOT, local)}`);
    } else {
      ok(`sitemap: ${loc} -> ${path.basename(local)}`);
    }
  }
}

// Saida
console.log('\n--- Site health (projeto_rullian) ---\n');
messages.forEach((line) => console.log(line));
console.log('');
if (errors > 0) {
  console.log(`Finalizado com ${errors} problema(s).\n`);
  process.exit(1);
}
console.log('Nenhum problema encontrado nos checks locais.\n');
process.exit(0);
