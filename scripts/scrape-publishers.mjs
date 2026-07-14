#!/usr/bin/env node
/**
 * scrape-publishers.mjs
 *
 * Scraper untuk katalog Light Novel dari penerbit Indonesia:
 *   - Elex Media Komputindo  → elexmedia.id/catalogs (Next.js SSR)
 *   - Penerbit Haru          → penerbitharu.com/buku/ (Bootstrap static)
 *   - M&C (Gramedia)         → ebooks.gramedia.com (Next.js SSR)
 *
 * Output: data/scraped/raw-{publisher}.json
 *
 * Cara pakai:
 *   node scripts/scrape-publishers.mjs
 *   node scripts/scrape-publishers.mjs --publisher haru
 *   node scripts/scrape-publishers.mjs --all
 *
 * Catatan:
 *   - Elex Media & Gramedia pakai Next.js → CSS module class names
 *     berisi hash (e.g. ProductCard_productCard__fGBQ_). Selector
 *     pakai partial match [class*="..."] agar tetap awet.
 *   - Haru pakai Bootstrap → class name statis (.boxbooks).
 *   - Harga tidak muncul di halaman listing Haru & Elex (hanya di
 *     halaman detail). Gramedia menampilkan harga di listing.
 *   - Semua item dikumpulkan tanpa filter LN. Normalizer (normalize-ln.mjs)
 *     yang akan melakukan fuzzy match terhadap STATIC_LN_CATALOG untuk
 *     menentukan item mana yang benar-benar Light Novel.
 */

import * as cheerio from 'cheerio';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'scraped');

// ─── User-Agent & HTTP helper ───

const USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

async function fetchPage(url, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const res = await fetch(url, {
                headers: {
                    'User-Agent': USER_AGENT,
                    Accept: 'text/html,application/xhtml+xml',
                    'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
                },
                signal: AbortSignal.timeout(15000),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            return await res.text();
        } catch (err) {
            if (attempt === retries) throw err;
            console.warn(`  ⚠️  Retry ${attempt + 1}/${retries}: ${err.message}`);
            await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
        }
    }
}

// ─── Scraped Item Type (tanpa isLN — normalizer yang handle matching) ───

const PUBLISHERS = {
    ELEX: 'Elex Media',
    HARU: 'Haru',
    MNC: 'M&C',
};

/**
 * @typedef {Object} ScrapedItem
 * @property {string} publisher
 * @property {string} title
 * @property {string} url
 * @property {string} price
 * @property {string} isbn
 * @property {string} releaseDate
 * @property {string} coverUrl
 */

// ─── Scraper: Elex Media ───
//
// Struktur HTML aktual (elexmedia.id/catalogs, Next.js SSR):
//   <div class="productItem menuProduct__item [hash]">       ← card container
//     <a class="productLink [hash]" href="/catalogs/...">   ← link detail
//       <div class="productTitle [hash]">Judul Buku</div>   ← title
//       <div class="productPrice [hash]">Rp 99.000</div>    ← price (mungkin tidak ada)
//       <div class="productImage [hash]">                   ← cover image
//         <img src="..." alt="Judul Buku" />
//       </div>
//     </a>
//   </div>
//
// Catatan: Class name Next.js mengandung hash (e.g. "productTitle_abc123").
// Selector pakai partial match [class*="..."] untuk menghindari perubahan hash.

const ELEX_CONFIG = {
    name: 'Elex Media',
    slug: 'elex',
    catalogUrl: 'https://elexmedia.id/catalogs',
    selectors: {
        // Partial match karena CSS module hash
        productCard: '[class*="productItem"]',
        title: '[class*="productTitle"]',
        link: '[class*="productLink"]',
        price: '[class*="productPrice"]',
    },
};

async function scrapeElex() {
    console.log(`\n📡 Scraping: ${ELEX_CONFIG.name}`);
    const items = [];

    try {
        const html = await fetchPage(ELEX_CONFIG.catalogUrl);
        const $ = cheerio.load(html);
        const sel = ELEX_CONFIG.selectors;

        console.log(`  📄 Halaman termuat (${html.length} bytes)`);

        $(sel.productCard).each((i, el) => {
            if (i >= 50) return false; // max 50 items

            const $el = $(el);
            const title = $el.find(sel.title).first().text().trim();
            if (!title) return;

            const linkEl = $el.find(sel.link).first();
            const href = linkEl.attr('href') || '';
            const url = href
                ? href.startsWith('http')
                    ? href
                    : new URL(href, ELEX_CONFIG.catalogUrl).href
                : '';

            const price = $el.find(sel.price).first().text().trim();

            items.push({
                publisher: PUBLISHERS.ELEX,
                title,
                url,
                price: price || '-',
            });
        });

        console.log(`  ✅ ${items.length} item ditemukan`);

        if (items.length === 0) {
            console.log(`  ⚠️  Tidak ada item. Mungkin halaman di-render client-side.`);
            console.log(`     Coba cek langsung: ${ELEX_CONFIG.catalogUrl}`);
        }
    } catch (err) {
        console.error(`  ❌ Error: ${err.message}`);
    }

    return items;
}

// ─── Scraper: Penerbit Haru ───
//
// Struktur HTML aktual (penerbitharu.com/buku/, Bootstrap):
//   <div class="boxbooks">                                     ← card container
//     <div class="boxbooks-img">
//       <a href="https://www.penerbitharu.com/buku/slug/">
//         <img src="..." alt="Judul Buku" />
//       </a>
//     </div>
//     <div class="boxbooks-text">
//       <h6>
//         <a href="https://www.penerbitharu.com/buku/slug/">Judul Buku</a>
//       </h6>                                                  ← title + link
//       <small>Penulis</small>
//       <p>Deskripsi singkat...</p>
//     </div>
//     <div class="boxbooks-foot">
//       <a class="btn btn-primary btn-xs" href="...">Baca detail</a>
//     </div>
//   </div>
//
// Catatan:
//   - Harga tidak muncul di halaman koleksi (hanya di detail)
//   - URL koleksi yang benar: /buku/ (bukan /koleksi-buku — 404)
//   - Class name Bootstrap statis, tidak berubah

const HARU_CONFIG = {
    name: 'Penerbit Haru',
    slug: 'haru',
    catalogUrl: 'https://www.penerbitharu.com/buku/',
    selectors: {
        productCard: '.boxbooks',
        title: 'h6 a',
        link: 'h6 a',
        // Harga tidak ada di listing, ambil dari detail nanti
    },
};

async function scrapeHaru() {
    console.log(`\n📡 Scraping: ${HARU_CONFIG.name}`);
    const items = [];

    try {
        const html = await fetchPage(HARU_CONFIG.catalogUrl);
        const $ = cheerio.load(html);
        const sel = HARU_CONFIG.selectors;

        console.log(`  📄 Halaman termuat (${html.length} bytes)`);

        $(sel.productCard).each((i, el) => {
            if (i >= 50) return false;

            const $el = $(el);
            const titleEl = $el.find(sel.title).first();
            const title = titleEl.text().trim();
            if (!title) return;

            const href = titleEl.attr('href') || '';
            const url = href
                ? href.startsWith('http')
                    ? href
                    : new URL(href, HARU_CONFIG.catalogUrl).href
                : '';

            items.push({
                publisher: PUBLISHERS.HARU,
                title,
                url,
                price: '-', // harga tidak tersedia di listing
            });
        });

        console.log(`  ✅ ${items.length} item ditemukan`);

        if (items.length === 0) {
            console.log(`  ⚠️  Tidak ada item. Cek langsung: ${HARU_CONFIG.catalogUrl}`);
        }
    } catch (err) {
        console.error(`  ❌ Error: ${err.message}`);
    }

    return items;
}

// ─── Scraper: M&C Gramedia ───
//
// Catatan: mncgramedia.id redirect ke site lain. M&C tidak punya
// katalog mandiri. Sumber terbaik adalah ebooks.gramedia.com (Next.js SSR).
// Gramedia.com search tidak bisa di-scrape dengan cheerio karena
// konten di-render client-side.
//
// Struktur HTML aktual (ebooks.gramedia.com/id/buku/penerbit/mc, Next.js SSR):
//   <a class="ProductCard_productCard__[hash]" href="/...">    ← card container (link)
//     <div class="ProductCard_productCardImage__[hash]">       ← cover
//       <img src="..." alt="Judul Buku" />
//     </div>
//     <div class="ProductCard_productCardDesc__[hash]">        ← info
//       <h2 data-testid="productCardTitle">Judul Buku</h2>     ← title
//       <div class="ProductCard_productCardPrice__[hash]">
//         <span data-testid="productCardFinalPrice">Rp ...</span> ← price
//       </div>
//     </div>
//   </a>

const MNC_CONFIG = {
    name: 'M&C Gramedia',
    slug: 'mnc',
    catalogUrl: 'https://ebooks.gramedia.com/id/buku/penerbit/mc',
    selectors: {
        // Partial match karena Next.js CSS module hash
        productCard: 'a[class*="ProductCard_productCard"]',
        title: 'h2[data-testid="productCardTitle"]',
        price: 'span[data-testid="productCardFinalPrice"]',
        // Link adalah card itu sendiri
    },
};

async function scrapeMNC() {
    console.log(`\n📡 Scraping: ${MNC_CONFIG.name}`);
    const items = [];

    try {
        const html = await fetchPage(MNC_CONFIG.catalogUrl);
        const $ = cheerio.load(html);
        const sel = MNC_CONFIG.selectors;

        console.log(`  📄 Halaman termuat (${html.length} bytes)`);

        $(sel.productCard).each((i, el) => {
            if (i >= 50) return false;

            const $el = $(el);
            const title = $el.find(sel.title).first().text().trim();
            if (!title) return;

            const href = $el.attr('href') || '';
            const url = href
                ? href.startsWith('http')
                    ? href
                    : new URL(href, 'https://ebooks.gramedia.com').href
                : '';

            const price = $el.find(sel.price).first().text().trim();

            items.push({
                publisher: PUBLISHERS.MNC,
                title,
                url,
                price: price || '-',
            });
        });

        console.log(`  ✅ ${items.length} item ditemukan`);

        if (items.length === 0) {
            console.log(`  ⚠️  Tidak ada item. Coba cek langsung: ${MNC_CONFIG.catalogUrl}`);
        }
    } catch (err) {
        console.error(`  ❌ Error: ${err.message}`);
    }

    return items;
}

// ─── Save helper ───

async function saveResults(publisherSlug, data) {
    if (!existsSync(DATA_DIR)) {
        await mkdir(DATA_DIR, { recursive: true });
    }

    const path = join(DATA_DIR, `raw-${publisherSlug}.json`);
    await writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`  💾 Disimpan: ${path}`);
}

// ─── Main ───

async function main() {
    const args = process.argv.slice(2);
    const publisherFlag = args.includes('--publisher')
        ? args[args.indexOf('--publisher') + 1]
        : args.includes('--all')
            ? 'all'
            : 'all'; // default: all

    console.log('╔══════════════════════════════════════════╗');
    console.log('║   WibuOtaku — Publisher Scraper         ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log(`   Mode: ${publisherFlag === 'all' ? 'Semua penerbit' : publisherFlag}`);
    console.log();

    const results = {};

    if (publisherFlag === 'all' || publisherFlag === 'elex') {
        const items = await scrapeElex();
        await saveResults('elex', items);
        results.elex = items;
    }

    if (publisherFlag === 'all' || publisherFlag === 'haru') {
        const items = await scrapeHaru();
        await saveResults('haru', items);
        results.haru = items;
    }

    if (publisherFlag === 'all' || publisherFlag === 'mnc') {
        const items = await scrapeMNC();
        await saveResults('mnc', items);
        results.mnc = items;
    }

    // Save combined
    const allItems = [...(results.elex || []), ...(results.haru || []), ...(results.mnc || [])];
    if (allItems.length > 0) {
        await saveResults('all', allItems);
    }

    console.log(`\n📊 Total: ${allItems.length} item dari semua penerbit`);
    console.log('✅ Selesai!\n');
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
