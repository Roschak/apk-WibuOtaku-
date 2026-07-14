import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Reveal } from '@/components/reveal';
import { Surface } from '@/components/surface';
import { weeklyCalendar } from '@/lib/site-data';

export default function CalendarPage() {
    return (
        <div className="space-y-8 pb-6">
            <PageHeader
                eyebrow="Kalender"
                title="Rilis anime dan buku dalam grid mingguan yang padat tetapi tetap terbaca."
                description="Kalender ini menyatukan simulcast, pre-order, feed publisher, dan rekapan scraping supaya user punya satu tampilan rapi."
            />

            <div className="grid gap-4 xl:grid-cols-2">
                {weeklyCalendar.map((day) => (
                    <Reveal key={day.day}>
                    <Surface>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="font-display text-2xl font-semibold text-white">{day.day}</p>
                                <p className="text-sm text-white/54">{day.subtitle}</p>
                            </div>
                            <span className="text-xs uppercase tracking-[0.24em] text-white/42">{day.items.length} item</span>
                        </div>
                        <div className="mt-5 space-y-3">
                            {day.items.map((item) => (
                                <div key={`${day.day}-${item.title}`} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/18 px-4 py-3 transition-all duration-200 hover:border-white/15 hover:bg-black/25">
                                    <div>
                                        <p className="font-medium text-white">{item.title}</p>
                                        <p className="text-sm text-white/56">{item.label}</p>
                                    </div>
                                    <Pill tone={item.tone}>{item.time}</Pill>
                                </div>
                            ))}
                        </div>
                    </Surface>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}