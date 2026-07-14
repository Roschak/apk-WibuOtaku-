import { AnimatedList } from '@/components/animated-list';
import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Reveal } from '@/components/reveal';
import { Surface } from '@/components/surface';
import { notificationFeed } from '@/lib/site-data';

export default function NotificationsPage() {
    const toneLabels = {
        gold: 'Anime',
        blue: 'LN',
        rose: 'Gap',
        emerald: 'System',
        slate: 'Lainnya',
    } as const;

    return (
        <div className="space-y-8 pb-6">
            <PageHeader
                eyebrow="Notifikasi"
                title="Episode baru, chapter baru, volume baru, dan perubahan feed yang penting."
                description="Semua alert ditulis ringkas supaya tidak mengganggu, tapi tetap cukup jelas untuk langsung ditindaklanjuti."
            />

            <Reveal>
            <Surface>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        ['Total alert', String(notificationFeed.length), 'Masuk timeline terbaru'],
                        ['Anime', String(notificationFeed.filter((item) => item.tone === 'gold').length), 'Episode dan simulcast'],
                        ['Light novel', String(notificationFeed.filter((item) => item.tone === 'blue').length), 'Volume dan listing'],
                        ['System', String(notificationFeed.filter((item) => item.tone === 'emerald').length), 'Sinkronisasi dan scrape'],
                    ].map(([label, value, detail]) => (
                        <div key={label} className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{label}</p>
                            <p className="mt-3 font-display text-4xl font-semibold text-white">{value}</p>
                            <p className="mt-2 text-sm leading-7 text-white/64">{detail}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    {(['Anime', 'LN', 'Gap', 'System'] as const).map((item) => (
                        <Pill key={item}>{item}</Pill>
                    ))}
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/64 animate-shimmer">
                    Notifikasi difokuskan pada update yang punya dampak langsung ke daftar tontonan, bacaan, dan koleksi.
                </div>

                <div className="mt-6 space-y-3">
                <AnimatedList>
                <div className="space-y-3">
                    {notificationFeed.map((item) => (
                        <div key={item.title} className="rounded-2xl border border-white/10 bg-black/18 p-4 transition-all duration-200 hover:border-white/15 hover:-translate-y-0.5 hover:bg-black/25">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-white">{item.title}</p>
                                    <p className="mt-2 text-sm leading-7 text-white/68">{item.detail}</p>
                                </div>
                                    <Pill tone={item.tone}>{toneLabels[item.tone]}</Pill>
                            </div>
                                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/38">{item.time}</p>
                        </div>
                    ))}
                </div>
                </AnimatedList>
                </div>
            </Surface>
            </Reveal>
        </div>
    );
}