#!/usr/bin/env node

const { setTimeout: sleep } = require('node:timers/promises');

const SITEMAP_URL = 'https://unlockedcoding.com/sitemap.xml';
const CONCURRENCY = 4;
const REQUEST_DELAY_MS = 250;

async function fetchText(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }

  return response.text();
}

function extractUrlsFromSitemap(xml) {
  const urls = new Set();
  const regex = /<loc>([^<]+)<\/loc>/gi;
  let match;

  while ((match = regex.exec(xml)) !== null) {
    const loc = match[1].trim();

    if (loc) {
      urls.add(loc);
    }
  }

  return Array.from(urls);
}

function cleanHtmlToWords(html) {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ');

  const textOnly = withoutScripts
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

  const words = textOnly
    .split(/[^\p{L}\p{N}']+/u)
    .map((word) => word.trim())
    .filter(Boolean);

  return words;
}

async function processUrl(url) {
  try {
    const html = await fetchText(url, {
      headers: {
        'User-Agent': 'Lite-LMSS-Crawler/1.0 (https://unlockedcoding.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    const words = cleanHtmlToWords(html);

    return { url, words: words.length };
  } catch (error) {
    return { url, error: error.message };
  }
}

async function * chunkedIterator(items, size) {
  for (let i = 0; i < items.length; i += size) {
    yield items.slice(i, i + size);
  }
}

async function main() {
  console.log(`Fetching sitemap: ${SITEMAP_URL}`);
  const sitemapXml = await fetchText(SITEMAP_URL);
  const urls = extractUrlsFromSitemap(sitemapXml);

  console.log(`Discovered ${urls.length} URLs. Crawling with concurrency ${CONCURRENCY}.`);

  const results = [];

  for await (const batch of chunkedIterator(urls, CONCURRENCY)) {
    const batchResults = await Promise.all(batch.map(processUrl));
    results.push(...batchResults);

    await sleep(REQUEST_DELAY_MS);
  }

  const successes = results.filter((result) => !result.error);
  const failures = results.filter((result) => result.error);

  successes.sort((a, b) => b.words - a.words);

  console.log('\nWord counts (descending):');
  console.table(successes);

  if (failures.length > 0) {
    console.log('\nErrors encountered:');
    failures.forEach(({ url, error: err }) => {
      console.log(`- ${url}: ${err}`);
    });
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exitCode = 1;
});

