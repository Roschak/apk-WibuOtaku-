import Link from 'next/link';

import { ContentCard } from '@/components/content-card';
import { PageHeader } from '@/components/page-header';
import { Surface } from '@/components/surface';
import { mangaCatalog } from '@/lib/site-data';

export default function MangaPage() {
  return (
    <div className="space-y-8 pb-6">
      <PageHeader
        eyebrow="Modul manga"
        title="Chapter global, chapter Indonesia, dan lisensi legal dalam satu tampilan."
        description="Fokus pada status ongoing, hiatus, atau tamat, lalu bandingkan chapter resmi dengan chapter di Indonesia ketika tersedia."
        actions={
          <>
            <Link href="/search" className="rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-semibold text-white">
              Cari judul
            </Link>
            <Link href="/koleksi" className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-950">
              Buka koleksi
            </Link>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {mangaCatalog.map((item) => (
          <ContentCard key={item.slug} {...item} href={`/manga/${item.slug}`} />
        ))}
      </div>

      <Surface>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Panduan lisensi</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {[
            ['Global chapter', 'Chapter terbaru dari sumber resmi atau agregat legal.'],
            ['Chapter Indonesia', 'Pisahkan angka resmi lokal supaya tidak tercampur.'],
            ['Platform baca', 'Tampilkan platform legal dan status lisensinya.'],
          ].map(([title, detail]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-black/18 p-5">
              <p className="font-semibold text-white">{title}</p>
              <p className="mt-2 text-sm leading-7 text-white/64">{detail}</p>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}