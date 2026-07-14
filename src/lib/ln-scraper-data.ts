/**
 * ln-scraper-data.ts
 *
 * Loader untuk data Light Novel hasil scraping dari publisher lokal.
 * Data dibaca dari file JSON di data/scraped/ln-catalog.json saat build time.
 *
 * Fallback: Jika file JSON tidak ada, return null → halaman pakai static data.
 *
 * Cara pakai scraper:
 *   node scripts/scrape-publishers.mjs
 *   node scripts/normalize-ln.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { LightNovelDetail } from '@/lib/site-data';

/** Scraped LN entry — extends LightNovelDetail with source metadata */
export interface ScrapedLNEntry extends LightNovelDetail {
    /** Metadata dari scraper */
    _source: 'scraped' | 'static';
    _publisher?: string;
    _url?: string;
    _scrapedAt?: string;
}

interface ScrapedCatalog {
    items: ScrapedLNEntry[];
    scrapedAt: string;
    total: number;
}

// Path ke data scraped — relatif terhadap root project
// Gunakan process.cwd() karena __dirname tidak tersedia di Next.js bundler ESM context
const SCRAPED_DATA_PATH = join(process.cwd(), 'data', 'scraped', 'ln-catalog.json');

let cachedScraped: ScrapedCatalog | null = null;

/**
 * Memuat data LN hasil scraping dari file JSON.
 * Return null jika file tidak tersedia.
 */
export function loadScrapedLNData(): ScrapedCatalog | null {
    if (cachedScraped) return cachedScraped;

    try {
        if (existsSync(SCRAPED_DATA_PATH)) {
            const raw = readFileSync(SCRAPED_DATA_PATH, 'utf-8');
            cachedScraped = JSON.parse(raw) as ScrapedCatalog;
            return cachedScraped;
        }
    } catch (err) {
        console.warn('[LN Scraper] Gagal membaca data scraped:', err);
    }

    return null;
}

/**
 * Mendapatkan LN by slug dari data scraped.
 * Jika tidak ditemukan, cari di static data sebagai fallback.
 */
export function getScrapedLNBySlug(slug: string): ScrapedLNEntry | null {
    const scraped = loadScrapedLNData();
    if (scraped?.items) {
        const found = scraped.items.find((item) => item.slug === slug);
        if (found) return found;
    }
    return null;
}

/**
 * Mengecek apakah data scraped tersedia.
 */
export function hasScrapedData(): boolean {
    return loadScrapedLNData() !== null;
}

/**
 * Mendapatkan timestamp scraping terakhir.
 */
export function getLastScrapedAt(): string | null {
    const data = loadScrapedLNData();
    return data?.scrapedAt ?? null;
}
