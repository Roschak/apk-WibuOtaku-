"use client";

import Link from 'next/link';
import { useState } from 'react';

import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Surface } from '@/components/surface';
import { searchIndex } from '@/lib/site-data';

function matchesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const results = searchIndex.filter((item) => {
    if (!query.trim()) {
      return true;
    }

    const metaText = item.meta.join(' ');

    return (
      matchesQuery(item.title, query) ||
      matchesQuery(item.summary, query) ||
      matchesQuery(item.kind, query) ||
      matchesQuery(metaText, query)
    );
  });

  return (
    <div className="space-y-8 pb-6">
      <PageHeader
        eyebrow="Pencarian global"
        title="Cari anime, manga, dan light novel dari satu index yang sama."
        description="Filter ini disiapkan sebagai fondasi pencarian lintas konten sebelum integrasi API dan full-text search yang lebih dalam."
        actions={
          <Link href="/wishlist" className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-950">
            Buka wishlist
          </Link>
        }
      />

      <Surface className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="search-query" className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
            Query
          </label>
          <input
            id="search-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari judul, status, chapter, studio, atau volume..."
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/36 outline-none transition focus:border-amber-200/30 focus:bg-black/30"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['Anime', 'Manga', 'Light Novel'].map((item) => (
            <Pill key={item}>{item}</Pill>
          ))}
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/64">
            {results.length} hasil cocok
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {results.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-3xl border border-white/10 bg-black/18 p-5 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{item.kind}</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-white">{item.title}</h2>
                </div>
                <Pill tone={item.tone}>Open</Pill>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/68">{item.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.meta.map((meta) => (
                  <span key={meta} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/72">
                    {meta}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Surface>
    </div>
  );
}