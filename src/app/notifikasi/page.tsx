import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Surface } from '@/components/surface';
import { notificationFeed } from '@/lib/site-data';

export default function NotificationsPage() {
  return (
    <div className="space-y-8 pb-6">
      <PageHeader
        eyebrow="Notifikasi"
        title="Episode baru, chapter baru, volume baru, dan perubahan feed yang penting."
        description="Semua alert ditulis ringkas supaya tidak mengganggu, tapi tetap cukup jelas untuk langsung ditindaklanjuti."
      />

      <Surface>
        <div className="space-y-3">
          {notificationFeed.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-black/18 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-white/68">{item.detail}</p>
                </div>
                <Pill tone={item.tone}>{item.time}</Pill>
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}