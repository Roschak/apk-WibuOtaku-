import Link from 'next/link';

import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Surface } from '@/components/surface';
import { libraryItems } from '@/lib/site-data';

export default function CollectionPage() {
  return (
    <div className="space-y-8 pb-6">
      <PageHeader
        eyebrow="Koleksi"
        title="Pin, progress, dan koleksi fisik yang sudah dimiliki di satu layar."
        description="Halaman ini cocok untuk kolektor dan pembaca aktif yang ingin memantau status baca, progress, dan barang yang sudah masuk rak."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {libraryItems.map((item) => (
          <Surface key={item.title} className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{item.kind}</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-white">{item.title}</h2>
                </div>
                <Pill tone={item.tone}>{item.status}</Pill>
              </div>
              <p className="text-sm leading-7 text-white/68">{item.note}</p>
              <div className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Progress</p>
                <p className="mt-2 text-sm text-white/72">{item.progress}</p>
              </div>
            </div>
            <Link href={item.href} className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-200 px-4 py-2 text-sm font-semibold text-slate-950">
              Buka detail
            </Link>
          </Surface>
        ))}
      </div>
    </div>
  );
}