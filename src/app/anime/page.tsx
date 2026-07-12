import Link from 'next/link';

import { ContentCard } from '@/components/content-card';
import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Surface } from '@/components/surface';
import { animeCatalog, weeklyCalendar } from '@/lib/site-data';

export default function AnimePage() {
  return (
    <div className="space-y-8 pb-6">
      <PageHeader
        eyebrow="Modul anime"
        title="Sedang tayang, akan tayang, tamat, dan klasik dalam satu tempat."
        description="List anime dipisah jelas, lengkap dengan jadwal simulcast, status rilisan, dan jalur notifikasi untuk episode berikutnya."
        actions={
          <>
            <Link href="/kalender" className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-950">
              Buka kalender
            </Link>
            <Link href="/wishlist" className="rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-semibold text-white">
              Masuk wishlist
            </Link>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {animeCatalog.map((item) => (
          <ContentCard key={item.slug} {...item} href={`/anime/${item.slug}`} />
        ))}
      </div>

      <Surface>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Kalender anime</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white">Rilis mingguan yang mudah dipindai.</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Season', 'Genre', 'Studio', 'Status', 'Rating'].map((item) => (
              <Pill key={item}>{item}</Pill>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {weeklyCalendar.map((day) => (
            <div key={day.day} className="rounded-3xl border border-white/10 bg-black/18 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xl font-semibold text-white">{day.day}</p>
                  <p className="text-sm text-white/54">{day.subtitle}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.24em] text-white/42">{day.items.length} slot</span>
              </div>
              <div className="mt-4 space-y-3">
                {day.items.map((item) => (
                  <div key={`${day.day}-${item.title}`} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-sm text-white/56">{item.label}</p>
                    </div>
                    <Pill tone={item.tone}>{item.time}</Pill>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}