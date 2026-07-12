import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Surface } from '@/components/surface';
import { getLightNovelBySlug } from '@/lib/site-data';

export default async function LightNovelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getLightNovelBySlug(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-6">
      <PageHeader
        eyebrow="Detail light novel"
        title={item.title}
        description={item.synopsis}
        actions={
          <>
            <Link href="/light-novel" className="rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-semibold text-white">
              Kembali ke list
            </Link>
            <Link href="/wishlist" className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-950">
              Tandai wishlist
            </Link>
          </>
        }
      />

      <Surface className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Pill tone={item.tone}>{item.kicker}</Pill>
          <Pill tone="slate">{item.status}</Pill>
          <Pill tone="slate">{item.gap}</Pill>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Volume Jepang</p>
            <p className="mt-3 font-display text-3xl font-semibold text-white">{item.jpVolume}</p>
            <p className="mt-2 text-sm text-white/62">{item.jpDate}</p>
            <p className="mt-5 text-sm leading-7 text-white/68">Publisher: {item.publisherJP}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Volume Indonesia</p>
            <p className="mt-3 font-display text-3xl font-semibold text-white">{item.idVolume}</p>
            <p className="mt-2 text-sm text-white/62">{item.idDate}</p>
            <p className="mt-5 text-sm leading-7 text-white/68">Publisher: {item.publisherID}</p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Detail rilis</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {item.detailFacts.map((fact) => (
                <div key={fact.label} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{fact.label}</p>
                  <p className="mt-2 text-sm text-white/72">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Cover & listing</p>
            <div className="mt-4 space-y-3">
              {item.coverNotes.map((note) => (
                <div key={note} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white/72">
                  {note}
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Metadata</p>
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/72">
              Harga: {item.priceID} • ISBN: {item.isbn}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Riwayat update</p>
          <div className="mt-4 space-y-3">
            {item.releaseNotes.map((note) => (
              <div key={note} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white/72">
                {note}
              </div>
            ))}
          </div>
        </div>
      </Surface>
    </div>
  );
}