import Link from 'next/link';

import { ContentCard } from '@/components/content-card';
import { PageHeader } from '@/components/page-header';
import { Surface } from '@/components/surface';
import { lightNovelCatalog } from '@/lib/site-data';

export default function LightNovelPage() {
  return (
    <div className="space-y-8 pb-6">
      <PageHeader
        eyebrow="Modul light novel"
        title="Volume Jepang vs Indonesia ditampilkan berdampingan, bukan tersembunyi di paragraf panjang."
        description="Halaman ini adalah pembeda utama WibuOtaku: gap volume, tanggal rilis, ISBN, harga, dan link beli legal dibuat eksplisit."
        actions={
          <>
            <Link href="/koleksi" className="rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-semibold text-white">
              Koleksi fisik
            </Link>
            <Link href="/notifikasi" className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-950">
              Alert rilis
            </Link>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {lightNovelCatalog.map((item) => (
          <ContentCard key={item.slug} {...item} href={`/light-novel/${item.slug}`} />
        ))}
      </div>

      <Surface>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Kunci tampilan</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {[
            ['JP vs ID', 'Volume terbaru Jepang dan Indonesia ditempatkan paralel.'],
            ['Gap volume', 'Selisih volume dihitung dan disorot di kartu utama.'],
            ['Beli legal', 'Harga, ISBN, dan link pre-order dibuat jelas.'],
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