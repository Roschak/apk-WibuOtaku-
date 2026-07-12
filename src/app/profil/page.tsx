import Link from 'next/link';

import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Surface } from '@/components/surface';

export default function ProfilePage() {
  return (
    <div className="space-y-8 pb-6">
      <PageHeader
        eyebrow="Profil"
        title="Preferensi user, perangkat, dan opsi notifikasi."
        description="Halaman profil disiapkan untuk pengaturan personal, sinkronisasi perangkat, dan kontrol alert yang lebih halus."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ['Nama tampilan', 'Wibu ID', 'Idenitas utama di dashboard.'],
          ['Wilayah', 'Indonesia', 'Format jadwal dan harga menyesuaikan WIB.'],
          ['Mode notifikasi', 'Ringkas', 'Hanya update yang paling relevan.'],
        ].map(([label, value, detail]) => (
          <Surface key={label}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{label}</p>
            <p className="mt-3 font-display text-2xl font-semibold text-white">{value}</p>
            <p className="mt-2 text-sm leading-7 text-white/64">{detail}</p>
          </Surface>
        ))}
      </div>

      <Surface>
        <div className="flex flex-wrap gap-2">
          {['ID / EN', 'Dark glass', 'Push ready', 'Progress sync', 'Discord later'].map((item) => (
            <Pill key={item}>{item}</Pill>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/wishlist" className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-950">
            Atur wishlist
          </Link>
          <Link href="/notifikasi" className="rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-semibold text-white">
            Kelola alert
          </Link>
        </div>
      </Surface>
    </div>
  );
}