#!/usr/bin/env node
/**
 * normalize-ln.mjs
 *
 * Menggabungkan data scraped dari publisher dengan data statis yang sudah ada,
 * lalu menghasilkan `data/scraped/ln-catalog.json`.
 *
 * Pipeline:
 *   Raw scraped JSON (data/scraped/raw-*.json)
 *       → Fuzzy match dengan slug dari static catalog (site-data.ts)
 *       → Gabung data Indonesia (scraper) + data Jepang (static)
 *       → Output: data/scraped/ln-catalog.json
 *
 * Cara pakai:
 *   node scripts/scrape-publishers.mjs
 *   node scripts/normalize-ln.mjs
 *   # atau: npm run scrape
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'scraped');

// ─── Static catalog inline (salinan dari site-data.ts untuk matching slug) ───

const STATIC_LN_CATALOG = [
    // ── Elex Media ──
    { slug: 'mushoku-tensei', title: 'Mushoku Tensei', publisher: 'Elex Media' },
    { slug: 'tensei-slime', title: 'That Time I Got Reincarnated as a Slime', publisher: 'Elex Media' },
    { slug: 'shield-hero', title: 'The Rising of the Shield Hero', publisher: 'Elex Media' },
    { slug: 'overlord', title: 'Overlord', publisher: 'Elex Media' },
    { slug: 'rezero', title: 'Re:Zero', publisher: 'Elex Media' },
    { slug: 'konosuba', title: 'KonoSuba', publisher: 'Elex Media' },
    { slug: 'danmachi', title: 'Is It Wrong to Try to Pick Up Girls in a Dungeon?', publisher: 'Elex Media' },
    { slug: 'goblin-slayer', title: 'Goblin Slayer', publisher: 'Elex Media' },
    { slug: 'tanya-the-evil', title: 'The Saga of Tanya the Evil', publisher: 'Elex Media' },
    { slug: 'bookworm', title: 'Ascendance of a Bookworm', publisher: 'Elex Media' },
    { slug: 'sword-art-online-progressive', title: 'Sword Art Online Progressive', publisher: 'Elex Media' },
    { slug: 'no-game-no-life', title: 'No Game No Life', publisher: 'Elex Media' },
    { slug: 'spice-and-wolf', title: 'Spice and Wolf', publisher: 'Elex Media' },
    { slug: 'irregular-magic', title: 'The Irregular at Magic High School', publisher: 'Elex Media' },
    { slug: 'log-horizon', title: 'Log Horizon', publisher: 'Elex Media' },

    // ── Haru ──
    { slug: 'the-apothecary-diaries', title: 'The Apothecary Diaries', publisher: 'Haru' },
    { slug: 'tearmoon-empire', title: 'Tearmoon Empire', publisher: 'Haru' },
    { slug: 'dukes-daughter', title: 'Accomplishments of the Duke\'s Daughter', publisher: 'Haru' },
    { slug: 'bibliophile-princess', title: 'Bibliophile Princess', publisher: 'Haru' },
    { slug: 'great-cleric', title: 'The Great Cleric', publisher: 'Haru' },
    { slug: 'reincarnated-sword', title: 'Reincarnated as a Sword', publisher: 'Haru' },
    { slug: 'villainess-taming', title: 'I\'m the Villainess, So I\'m Taming the Final Boss', publisher: 'Haru' },
    { slug: 'saint-power', title: 'The Saint\'s Magic Power is Omnipotent', publisher: 'Haru' },

    // ── M&C ──
    { slug: 'classroom-of-the-elite', title: 'Classroom of the Elite', publisher: 'M&C' },
    { slug: 'eminence-shadow', title: 'The Eminence in Shadow', publisher: 'M&C' },
    { slug: 'spirit-chronicles', title: 'Seirei Gensouki: Spirit Chronicles', publisher: 'M&C' },
    { slug: 'executioner-way-life', title: 'The Executioner and Her Way of Life', publisher: 'M&C' },
    { slug: 'genius-prince', title: 'The Genius Prince\'s Guide to Raising a Nation Out of Debt', publisher: 'M&C' },
    { slug: 'roll-over-dying', title: 'Roll Over and Die', publisher: 'M&C' },
];

// ─── Fuzzy match ───

function normalizeForMatch(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function matchScore(scrapedTitle, staticEntry) {
    const s = normalizeForMatch(scrapedTitle);
    const st = normalizeForMatch(staticEntry.title);

    // Exact match
    if (s === st) return 1;

    // One contains the other
    if (s.includes(st) || st.includes(s)) return 0.9;

    // Word overlap
    const sWords = s.split(' ').filter((w) => w.length > 2);
    const stWords = st.split(' ').filter((w) => w.length > 2);
    if (sWords.length === 0 || stWords.length === 0) return 0;

    const common = sWords.filter((w) => stWords.includes(w));
    return common.length / Math.max(sWords.length, stWords.length);
}

// ─── Build LightNovelDetail entry ───

function buildLNEntry(scraped, staticMatch = null) {
    const title = scraped.title || staticMatch?.title || 'Unknown';

    // Parse volume
    const volMatch = scraped.title?.match(/(?:Vol\.?\s*|Volume\s*)(\d+)/i) ||
        scraped.url?.match(/(?:vol|volume)[.\s]*(\d+)/i);
    const volumeNum = volMatch ? volMatch[1] : null;

    const idVolume = volumeNum ? `Volume ${volumeNum}` : '-';
    const idDate = scraped.releaseDate || '-';

    // Slug: pakai dari static match jika ada, jika tidak pakai title-scraped-
    const slug = staticMatch?.slug || `scraped-${scraped.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

    return {
        slug,
        title,
        kicker: staticMatch ? 'LN tracked (auto)' : 'LN baru (auto)',
        blurb: `Light novel ${scraped.publisher} — ${idVolume}. ` +
            (staticMatch ? `Jepang: lihat detail.` : `Data dari scraping otomatis.`),
        status: staticMatch
            ? `Volume Indonesia: ${idVolume} (${idDate})`
            : `Terpantau: ${idVolume} via scraper`,
        meta: [
            scraped.publisher,
            idVolume,
            staticMatch ? 'Licensed' : 'Scraped',
        ],
        tone: 'emerald',
        cta: 'Buka detail LN',
        // Data Jepang hanya dari static match
        jpVolume: staticMatch?.jpVolume || '-',
        jpDate: staticMatch?.jpDate || '-',
        idVolume,
        idDate,
        gap: staticMatch?.jpVolume
            ? `Gap ${(parseInt(staticMatch.jpVolume.replace(/\D/g, '')) || 0) - (volumeNum || 0)} volume`
            : 'Perlu data Jepang',
        publisherJP: staticMatch?.publisherJP || '-',
        publisherID: scraped.publisher,
        priceID: scraped.price || staticMatch?.priceID || '-',
        isbn: scraped.isbn || staticMatch?.isbn || '-',
        synopsis: staticMatch?.synopsis ||
            `Light novel dari ${scraped.publisher}. ` +
            `Volume Indonesia terbaru: ${idVolume} (${idDate}). ` +
            `Harga: ${scraped.price || 'N/A'} — ISBN: ${scraped.isbn || 'N/A'}.`,
        detailFacts: [
            { label: 'Jepang', value: staticMatch?.jpVolume || '-' },
            { label: 'Indonesia', value: idVolume },
            { label: 'Tanggal ID', value: idDate },
            { label: 'Publisher ID', value: scraped.publisher },
            { label: 'Harga', value: scraped.price || staticMatch?.priceID || '-' },
            { label: 'ISBN', value: scraped.isbn || staticMatch?.isbn || '-' },
        ],
        coverNotes: [
            'Data dari scraping otomatis publisher',
            'ISBN dan harga dari katalog resmi',
            staticMatch ? 'Cover Jepang dan Indonesia bisa berbeda' : 'Cover: lihat katalog publisher',
        ],
        releaseNotes: [
            `Volume Indonesia terbaru: ${idVolume} (${idDate})`,
            `Publisher: ${scraped.publisher}`,
            `Harga: ${scraped.price || 'N/A'} • ISBN: ${scraped.isbn || 'N/A'}`,
            staticMatch
                ? 'Gap dengan volume Jepang dihitung otomatis'
                : 'Data Jepang: belum tersedia (tambah manual atau dari AniList)',
            'Data diperbarui otomatis via scraper mingguan',
        ],
        related: staticMatch?.related || [
            'Wishlist beli',
            'Koleksi fisik',
            'Notifikasi preorder',
        ],
        _source: 'scraped',
        _publisher: scraped.publisher,
        _url: scraped.url || '',
    };
}

// ─── Main ───

async function main() {
    console.log('\n🔧 Normalize LN Data — matching scraped → static slugs');
    console.log('   Membaca data scraped...\n');

    const rawFiles = ['raw-elex.json', 'raw-haru.json', 'raw-mnc.json'];
    const allScraped = [];

    for (const file of rawFiles) {
        const path = join(DATA_DIR, file);
        if (existsSync(path)) {
            try {
                const raw = JSON.parse(await readFile(path, 'utf-8'));
                allScraped.push(...raw);
                console.log(`   ✓ ${file}: ${raw.length} item`);
            } catch (err) {
                console.warn(`   ⚠️  ${file}: error parsing — ${err.message}`);
            }
        } else {
            console.log(`   - ${file}: tidak ditemukan`);
        }
    }

    if (allScraped.length === 0) {
        console.log('\n⚠️  Tidak ada data scraped. Buat sample untuk development.\n');
        await createSampleData();
        return;
    }

    // Semua item dari scraper masuk ke fuzzy match.
    // Hanya item yang match dengan static catalog (score ≥ 0.6) yang disimpan.
    // Item yang tidak match di-drop karena bukan LN (e.g. buku pendidikan, agama).
    console.log(`\n📚 ${allScraped.length} item dari scraper — fuzzy match ke ${STATIC_LN_CATALOG.length} slug statis`);

    const matched = [];
    const unmatched = [];
    const usedSlugs = new Set();

    for (const item of allScraped) {
        let bestScore = 0;
        let bestMatch = null;

        for (const staticEntry of STATIC_LN_CATALOG) {
            const score = matchScore(item.title, staticEntry);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = staticEntry;
            }
        }

        if (bestScore >= 0.6 && bestMatch && !usedSlugs.has(bestMatch.slug)) {
            usedSlugs.add(bestMatch.slug);
            matched.push({ scraped: item, static: bestMatch });
            console.log(`   🔗 Matched: "${item.title}" → slug: ${bestMatch.slug} (score: ${bestScore.toFixed(2)})`);
        } else {
            unmatched.push(item);
            console.log(`   ❌ No match: "${item.title}"`);
        }
    }

    // Build catalog: hanya matched items yang masuk. Unmatched di-drop
    // karena bukan Light Novel (buku pendidikan, novel umum, dll).
    const catalog = matched.map(({ scraped, static: st }) => buildLNEntry(scraped, st));

    console.log(`\n📦 ${catalog.length} entry final (matched):`);
    console.log(`   - ${matched.length} matched with static data`);
    if (unmatched.length > 0) {
        console.log(`   - ${unmatched.length} item dropped (no match in static catalog)`);
    }

    // Simpan
    if (!existsSync(DATA_DIR)) {
        await mkdir(DATA_DIR, { recursive: true });
    }

    const outputPath = join(DATA_DIR, 'ln-catalog.json');
    const output = {
        items: catalog,
        scrapedAt: new Date().toISOString(),
        total: catalog.length,
    };
    await writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`\n✅ Disimpan: ${outputPath}\n`);
}

async function createSampleData() {
    const sampleScraped = [
        {
            publisher: 'Elex Media',
            title: 'Mushoku Tensei Vol. 23',
            url: 'https://elexmedia.id/catalogs/mushoku-tensei-23',
            price: 'Rp 135.000',
            isbn: '978-623-00-1234-5',
            releaseDate: '20 Feb 2025',
            isLN: true,
        },
        {
            publisher: 'Haru',
            title: 'The Apothecary Diaries Vol. 10',
            url: 'https://penerbitharu.com/koleksi/apothecary-diaries-10',
            price: 'Rp 125.000',
            isbn: '978-623-00-5678-9',
            releaseDate: '18 Sep 2025',
            isLN: true,
        },
        {
            publisher: 'M&C',
            title: 'Classroom of the Elite Vol. 8',
            url: 'https://mncgramedia.id/books/classroom-of-the-elite-8',
            price: 'Rp 110.000',
            isbn: '978-623-00-9012-3',
            releaseDate: '02 Mar 2025',
            isLN: true,
        },
    ];

    // Match against static catalog
    const matched = sampleScraped.map((item) => {
        let bestScore = 0;
        let bestMatch = null;
        for (const st of STATIC_LN_CATALOG) {
            const score = matchScore(item.title, st);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = st;
            }
        }
        return { scraped: item, static: bestScore >= 0.6 ? bestMatch : null };
    });

    const catalog = matched.map(({ scraped, static: st }) => buildLNEntry(scraped, st));

    if (!existsSync(DATA_DIR)) {
        await mkdir(DATA_DIR, { recursive: true });
    }

    const outputPath = join(DATA_DIR, 'ln-catalog.json');
    const output = {
        items: catalog,
        scrapedAt: new Date().toISOString(),
        total: catalog.length,
    };
    await writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8');

    console.log(`✅ Sample data dibuat: ${outputPath}`);
    for (const entry of catalog) {
        const matchStatus = matched.find((m) => m.scraped.title === entry.title);
        console.log(`   ${entry.slug} — ${matchStatus?.static ? '✓ matched' : '✗ scraped-only'}`);
    }
    console.log();
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
