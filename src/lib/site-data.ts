export type Tone = 'gold' | 'blue' | 'rose' | 'emerald' | 'slate';

export type DashboardStat = {
  label: string;
  value: string;
  note: string;
  tone: Tone;
};

export type ReleaseSource = {
  name: string;
  kind: string;
  status: string;
  cadence: string;
  lastRun: string;
  delta: string;
};

export type RoadmapItem = {
  phase: string;
  title: string;
  note: string;
  progress: string;
  tone: Tone;
};

export type FeedItem = {
  title: string;
  detail: string;
  time: string;
  tone: Tone;
};

export type LibraryItem = {
  title: string;
  kind: string;
  status: string;
  progress: string;
  note: string;
  href: string;
  tone: Tone;
};

export type AnimeDetail = {
  slug: string;
  title: string;
  kicker: string;
  blurb: string;
  status: string;
  meta: string[];
  tone: Tone;
  cta: string;
  season: string;
  studio: string;
  schedule: string;
  source: string;
  episodeCount: string;
  synopsis: string;
  detailFacts: { label: string; value: string }[];
  highlights: string[];
  cast: string[];
  related: string[];
};

export type MangaDetail = {
  slug: string;
  title: string;
  kicker: string;
  blurb: string;
  status: string;
  meta: string[];
  tone: Tone;
  cta: string;
  type: string;
  globalChapter: string;
  indoChapter: string;
  legalPlatform: string;
  publisher: string;
  synopsis: string;
  detailFacts: { label: string; value: string }[];
  releaseNotes: string[];
  related: string[];
};

export type LightNovelDetail = {
  slug: string;
  title: string;
  kicker: string;
  blurb: string;
  status: string;
  meta: string[];
  tone: Tone;
  cta: string;
  jpVolume: string;
  jpDate: string;
  idVolume: string;
  idDate: string;
  gap: string;
  publisherJP: string;
  publisherID: string;
  priceID: string;
  isbn: string;
  synopsis: string;
  detailFacts: { label: string; value: string }[];
  coverNotes: string[];
  releaseNotes: string[];
  related: string[];
};

export type SearchIndexItem = {
  kind: string;
  title: string;
  href: string;
  summary: string;
  meta: string[];
  tone: Tone;
};

export const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Anime', href: '/anime' },
  { label: 'Manga', href: '/manga' },
  { label: 'Light Novel', href: '/light-novel' },
  { label: 'Kalender', href: '/kalender' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Koleksi', href: '/koleksi' },
  { label: 'Notifikasi', href: '/notifikasi' },
  { label: 'Profil', href: '/profil' },
  { label: 'Admin', href: '/admin' },
  { label: 'Search', href: '/search' },
];

export const dashboardStats: DashboardStat[] = [
  { label: 'Judul terpantau', value: '1.284', note: 'anime, manga, dan LN yang siap disinkronkan', tone: 'gold' },
  { label: 'Update hari ini', value: '37', note: 'data baru dari API dan feed publisher', tone: 'blue' },
  { label: 'Gap LN ID', value: '12', note: 'seri masih tertinggal dari volume Jepang', tone: 'rose' },
  { label: 'Scraper sehat', value: '94%', note: 'pipeline berjalan, 1 sumber butuh review', tone: 'emerald' },
];

export const releaseSources: ReleaseSource[] = [
  { name: 'AniList API', kind: 'Anime', status: 'Aktif', cadence: '15 menit', lastRun: '08.45 WIB', delta: '+18 perubahan' },
  { name: 'Jikan API', kind: 'Anime', status: 'Aktif', cadence: '30 menit', lastRun: '08.50 WIB', delta: '+6 perubahan' },
  { name: 'Gramedia / toko resmi', kind: 'LN Indonesia', status: 'Review', cadence: '2 jam', lastRun: '08.10 WIB', delta: '+2 rilis baru' },
  { name: 'Feed publisher lokal', kind: 'Berita', status: 'Aktif', cadence: '1 jam', lastRun: '08.55 WIB', delta: '+4 posting' },
];

export const roadmap: RoadmapItem[] = [
  { phase: 'Fase 1', title: 'MVP web', note: 'Dashboard, list anime, detail, kalender, pin, dan wishlist.', progress: '80%', tone: 'gold' },
  { phase: 'Fase 2', title: 'Manga & LN', note: 'Model data, perbandingan volume JP vs ID, dan tracking baca.', progress: '55%', tone: 'blue' },
  { phase: 'Fase 3', title: 'Scraper otomatis', note: 'Pipeline scrape, normalize, dedupe, dan log perubahan.', progress: '35%', tone: 'rose' },
  { phase: 'Fase 4', title: 'PWA + APK', note: 'Manifest, service worker, dan build ke Capacitor/TWA.', progress: '20%', tone: 'emerald' },
];

export const notificationFeed: FeedItem[] = [
  { title: 'Episode baru tayang', detail: 'Frieren: Beyond Journey’s End menambah episode minggu ini.', time: '12 menit lalu', tone: 'gold' },
  { title: 'Volume LN Indonesia terbit', detail: 'Penerbit lokal mengumumkan volume terbaru dengan ISBN aktif.', time: '32 menit lalu', tone: 'blue' },
  { title: 'Gap meningkat', detail: 'Salah satu LN populer di Jepang naik satu volume lagi.', time: '1 jam lalu', tone: 'rose' },
  { title: 'Scrape selesai', detail: 'Sumber feed publisher berhasil disinkronkan tanpa konflik data.', time: '2 jam lalu', tone: 'emerald' },
];

export const weeklyCalendar = [
  {
    day: 'Senin',
    subtitle: 'Pembuka minggu',
    items: [
      { time: '07.00', title: 'Anime simulcast', label: 'Episode premium', tone: 'gold' as Tone },
      { time: '18.30', title: 'Feed publisher lokal', label: 'Pre-order LN', tone: 'blue' as Tone },
    ],
  },
  {
    day: 'Selasa',
    subtitle: 'Update katalog',
    items: [
      { time: '12.00', title: 'Manga legal platform', label: 'Chapter baru', tone: 'rose' as Tone },
      { time: '21.00', title: 'Scraper normalization', label: 'Match review', tone: 'emerald' as Tone },
    ],
  },
  {
    day: 'Rabu',
    subtitle: 'Hari gap LN',
    items: [
      { time: '09.00', title: 'Light novel Indonesia', label: 'Volume gap', tone: 'gold' as Tone },
      { time: '20.00', title: 'Anime upcoming', label: 'Countdown', tone: 'blue' as Tone },
    ],
  },
  {
    day: 'Kamis',
    subtitle: 'Cadence tinggi',
    items: [
      { time: '10.30', title: 'Jikan sync', label: 'Metadata diff', tone: 'rose' as Tone },
      { time: '22.00', title: 'Wishlist update', label: 'Personal library', tone: 'emerald' as Tone },
    ],
  },
  {
    day: 'Jumat',
    subtitle: 'Prime time',
    items: [
      { time: '19.00', title: 'Episode malam', label: 'Simulcast WIB', tone: 'gold' as Tone },
      { time: '23.00', title: 'Log audit', label: 'Error review', tone: 'blue' as Tone },
    ],
  },
  {
    day: 'Sabtu',
    subtitle: 'Belanja koleksi',
    items: [
      { time: '11.00', title: 'Harga buku fisik', label: 'Marketplace', tone: 'rose' as Tone },
      { time: '17.00', title: 'Koleksi pribadi', label: 'Owned volumes', tone: 'emerald' as Tone },
    ],
  },
  {
    day: 'Minggu',
    subtitle: 'Rekap pekanan',
    items: [
      { time: '08.00', title: 'Trending pinned', label: 'Most saved', tone: 'gold' as Tone },
      { time: '20.30', title: 'Roadmap review', label: 'Planning', tone: 'blue' as Tone },
    ],
  },
];

export const libraryItems: LibraryItem[] = [
  { title: 'Sousou no Frieren', kind: 'Anime', status: 'Pinned', progress: 'Episode 15/24', note: 'Menunggu recap mingguan', href: '/anime/sousou-no-frieren', tone: 'gold' },
  { title: 'Kagurabachi', kind: 'Manga', status: 'Wishlist', progress: 'Chapter 28', note: 'Baca legal di platform resmi', href: '/manga/kagurabachi', tone: 'blue' },
  { title: 'Mushoku Tensei', kind: 'Light Novel', status: 'Reading', progress: 'Vol. 23', note: 'ID tertinggal 3 volume', href: '/light-novel/mushoku-tensei', tone: 'rose' },
  { title: 'The Apothecary Diaries', kind: 'Light Novel', status: 'Owned', progress: 'Vol. 7', note: 'Koleksi fisik lengkap', href: '/light-novel/the-apothecary-diaries', tone: 'emerald' },
];

export const animeCatalog: AnimeDetail[] = [
  {
    slug: 'sousou-no-frieren',
    title: 'Sousou no Frieren',
    kicker: 'Sedang tayang',
    blurb: 'Peringatan lembut bahwa cerita terbaik sering dimulai setelah petualangan besar berakhir.',
    status: 'Episode baru tiap Jumat',
    meta: ['Madhouse', 'Fall slate', 'Simulcast WIB'],
    tone: 'gold',
    cta: 'Buka detail anime',
    season: 'Fall slate',
    studio: 'Madhouse',
    schedule: 'Jumat, 22.00 WIB',
    source: 'Manga',
    episodeCount: '24 episode',
    synopsis: 'Seorang penyihir elf menelusuri ulang jejak masa lalu dan membangun makna baru dari perjalanan yang telah selesai.',
    detailFacts: [
      { label: 'Jadwal', value: 'Jumat malam' },
      { label: 'Sumber adaptasi', value: 'Manga populer' },
      { label: 'Arah visual', value: 'Hangat dan tenang' },
      { label: 'Mode pantau', value: 'Countdown aktif' },
    ],
    highlights: ['Countdown episode berikutnya', 'Karakter dan seiyuu', 'Jadwal tayang mingguan'],
    cast: ['Frieren', 'Fern', 'Stark', 'Heiter'],
    related: ['Kalender simulcast', 'Wishlist pribadi', 'Rekomendasi seasonal'],
  },
  {
    slug: 'dandadan',
    title: 'Dandadan',
    kicker: 'Akan tayang',
    blurb: 'Dua dunia bertabrakan: yang supranatural dan yang anehnya romantis, sama-sama tidak masuk akal.',
    status: 'Countdown ke jadwal rilis',
    meta: ['Science SARU', 'Upcoming', 'Genre campuran'],
    tone: 'blue',
    cta: 'Buka detail anime',
    season: 'Upcoming cour',
    studio: 'Science SARU',
    schedule: 'Rilis malam sesuai jadwal lokal',
    source: 'Manga',
    episodeCount: 'TBA',
    synopsis: 'Perburuan urban legend berubah jadi aksi cepat, komedi liar, dan chemistry yang tidak direncanakan.',
    detailFacts: [
      { label: 'Status', value: 'Upcoming simulcast' },
      { label: 'Genre', value: 'Action / supernatural' },
      { label: 'Pantauan', value: 'Weekly release' },
      { label: 'Alert', value: 'Pin untuk notifikasi' },
    ],
    highlights: ['Notifikasi episode perdana', 'Feed teaser dan trailer', 'Tracker simpan otomatis'],
    cast: ['Momo', 'Okarun', 'Turbo Granny', 'Seiko'],
    related: ['Akan tayang', 'Pin cepat', 'Wishlist anti lupa'],
  },
  {
    slug: 'kaiju-no-8',
    title: 'Kaiju No. 8',
    kicker: 'Sudah tamat',
    blurb: 'Ketika ancaman raksasa menjadi rutinitas, aplikasi ini menandai semua fase rilis dengan rapi.',
    status: 'Selesai tayang dan siap diarsip',
    meta: ['Production I.G', 'Completed', 'Archive ready'],
    tone: 'rose',
    cta: 'Buka detail anime',
    season: 'Archived season',
    studio: 'Production I.G',
    schedule: 'Arsip episode lengkap',
    source: 'Manga',
    episodeCount: 'Tamat',
    synopsis: 'Seorang pria yang tak pernah menyerah mendapatkan kesempatan kedua untuk bertarung di garis depan.',
    detailFacts: [
      { label: 'Status', value: 'Completed' },
      { label: 'Arsip', value: 'Episode lengkap' },
      { label: 'Cocok untuk', value: 'Binge watch' },
      { label: 'Langganan', value: 'Masuk wishlist' },
    ],
    highlights: ['Binge list', 'Review pribadi', 'History tontonan'],
    cast: ['Kafka', 'Kikoru', 'Mina', 'Soshiro'],
    related: ['Koleksi selesai', 'Rekap season', 'Favorit personal'],
  },
];

export const mangaCatalog: MangaDetail[] = [
  {
    slug: 'kagurabachi',
    title: 'Kagurabachi',
    kicker: 'Manga ongoing',
    blurb: 'Setiap chapter menonjolkan ritme cepat, pencarian balas dendam, dan daftar bacaan yang harus terus sinkron.',
    status: 'Chapter global terbaru aktif',
    meta: ['Ongoing', 'Legal platform', 'Indonesia tracking'],
    tone: 'gold',
    cta: 'Buka detail manga',
    type: 'Manga',
    globalChapter: 'Chapter 61',
    indoChapter: 'Chapter 28 legal',
    legalPlatform: 'MANGA Plus dan platform resmi pilihan',
    publisher: 'Belum ada penerbit lokal tetap',
    synopsis: 'Seorang anak pandai besi mengejar keadilan dengan pedang yang tidak mengikuti aturan biasa.',
    detailFacts: [
      { label: 'Status', value: 'Ongoing' },
      { label: 'Chapter global', value: '61' },
      { label: 'Chapter resmi Indo', value: '28' },
      { label: 'Lisensi', value: 'Pantau perubahan' },
    ],
    releaseNotes: ['Update chapter otomatis dari API publik', 'Status lisensi ditandai jika publisher lokal muncul', 'Timeline chapter Indonesia dipisah jelas'],
    related: ['Wishlist baca', 'Trending minggu ini', 'Chapter resmi'],
  },
  {
    slug: 'oshi-no-ko',
    title: 'Oshi no Ko',
    kicker: 'Manga selesai',
    blurb: 'Untuk judul besar yang sudah tamat, aplikasi tetap menampilkan jejak lisensi, chapter, dan koleksi fisik.',
    status: 'Arsip lengkap siap dibaca ulang',
    meta: ['Completed', 'License aware', 'Archive mode'],
    tone: 'blue',
    cta: 'Buka detail manga',
    type: 'Manga',
    globalChapter: 'Chapter 166',
    indoChapter: 'Chapter 154 legal',
    legalPlatform: 'Platform baca resmi dan katalog publisher',
    publisher: 'Cek katalog lokal untuk cetak ulang',
    synopsis: 'Sorot panggung, drama identitas, dan jalur industri hiburan yang penuh permukaan dan retak di bawahnya.',
    detailFacts: [
      { label: 'Status', value: 'Completed' },
      { label: 'Global', value: '166 chapter' },
      { label: 'Indonesia', value: '154 chapter resmi' },
      { label: 'Mode', value: 'Collector friendly' },
    ],
    releaseNotes: ['Riwayat chapter mudah ditelusuri', 'Archive cocok untuk pembaca tuntas', 'Catatan lisensi tetap terlihat'],
    related: ['Koleksi pribadi', 'Riwayat baca', 'Rekomendasi drama'],
  },
  {
    slug: 'spy-x-family',
    title: 'Spy x Family',
    kicker: 'Manga populer',
    blurb: 'Format keluarga palsu, pembaruan rutin, dan jalur lisensi yang harus langsung terlihat di dashboard.',
    status: 'Ongoing dengan rilis konsisten',
    meta: ['Ongoing', 'Family hit', 'Licensing active'],
    tone: 'rose',
    cta: 'Buka detail manga',
    type: 'Manga',
    globalChapter: 'Chapter 104',
    indoChapter: 'Chapter 90 resmi',
    legalPlatform: 'Platform baca legal dan katalog penerbit',
    publisher: 'Partner lokal aktif sesuai wilayah',
    synopsis: 'Spionase, kekacauan rumah tangga, dan komedi yang terus bertahan lewat format chapter pendek.',
    detailFacts: [
      { label: 'Status', value: 'Ongoing' },
      { label: 'Global', value: '104 chapter' },
      { label: 'Indonesia', value: '90 chapter resmi' },
      { label: 'Format', value: 'Family comedy' },
    ],
    releaseNotes: ['Chapter dan status lisensi dipisah', 'Cocok untuk detail legal platform', 'Update cepat saat ada penerbit baru'],
    related: ['Legal platform', 'Wishlist', 'Pin favorit'],
  },
];

export const lightNovelCatalog: LightNovelDetail[] = [
  {
    slug: 'mushoku-tensei',
    title: 'Mushoku Tensei',
    kicker: 'LN gap tracker',
    blurb: 'Model terbaik untuk membandingkan volume Jepang dan Indonesia tanpa harus buka dua situs sekaligus.',
    status: 'Gap volume perlu dipantau',
    meta: ['Japan vol. 26', 'Indonesia vol. 23', 'Publisher active'],
    tone: 'gold',
    cta: 'Buka detail LN',
    jpVolume: 'Volume 26',
    jpDate: 'Terbit 12 Jan 2026',
    idVolume: 'Volume 23',
    idDate: 'Terbit 20 Feb 2025',
    gap: 'Gap 3 volume',
    publisherJP: 'MF Books',
    publisherID: 'Elex Media',
    priceID: 'Rp 135.000',
    isbn: 'ISBN aktif pada listing resmi',
    synopsis: 'Perjalanan reinkarnasi yang panjang, konsisten, dan ideal untuk menampilkan dua kolom volume berdampingan.',
    detailFacts: [
      { label: 'Jepang', value: 'Vol. 26' },
      { label: 'Indonesia', value: 'Vol. 23' },
      { label: 'Gap', value: '3 volume' },
      { label: 'Status lisensi', value: 'Licensed' },
    ],
    coverNotes: ['Cover Jepang dan Indonesia bisa berbeda', 'ISBN dan harga dipisah jelas', 'Pre-order link langsung terlihat'],
    releaseNotes: ['Update volume Jepang otomatis', 'Volume Indonesia mengikuti feed publisher lokal', 'Gap dihitung di UI'],
    related: ['Wishlist beli', 'Koleksi fisik', 'Notifikasi preorder'],
  },
  {
    slug: 'the-apothecary-diaries',
    title: 'The Apothecary Diaries',
    kicker: 'LN licensed',
    blurb: 'Judul yang cocok untuk memperlihatkan penerbit Jepang, penerbit lokal, dan harga ritel resmi.',
    status: 'Volume Indonesia aktif di katalog',
    meta: ['Licensed', 'Retail ready', 'Cover compare'],
    tone: 'blue',
    cta: 'Buka detail LN',
    jpVolume: 'Volume 14',
    jpDate: 'Terbit 30 Nov 2025',
    idVolume: 'Volume 10',
    idDate: 'Terbit 18 Sep 2025',
    gap: 'Gap 4 volume',
    publisherJP: 'Hero Bunko',
    publisherID: 'Haru',
    priceID: 'Rp 125.000',
    isbn: 'ISBN resmi katalog toko',
    synopsis: 'Intrik istana, investigasi, dan edisi lokal yang perlu dipantau terpisah dari volume Jepang.',
    detailFacts: [
      { label: 'Jepang', value: 'Vol. 14' },
      { label: 'Indonesia', value: 'Vol. 10' },
      { label: 'Publisher ID', value: 'Haru' },
      { label: 'Mode', value: 'Collector friendly' },
    ],
    coverNotes: ['Perbandingan cover disiapkan berdampingan', 'Harga dan ISBN masuk kartu detail', 'Link beli tetap legal'],
    releaseNotes: ['Data toko dan publisher bisa digabung', 'Update volume terbaru otomatis', 'Gap volume disorot besar'],
    related: ['Beli legal', 'Koleksi fisik', 'Pin judul'],
  },
  {
    slug: 'classroom-of-the-elite',
    title: 'Classroom of the Elite',
    kicker: 'LN populer',
    blurb: 'Judul dengan lisensi aktif dan volume yang sering jadi acuan untuk pengguna yang ingin membandingkan wilayah rilis.',
    status: 'Volume Indonesia tertinggal beberapa jilid',
    meta: ['Licensed', 'Popular', 'Gap tracker'],
    tone: 'rose',
    cta: 'Buka detail LN',
    jpVolume: 'Volume 12',
    jpDate: 'Terbit 25 Agu 2025',
    idVolume: 'Volume 8',
    idDate: 'Terbit 02 Mar 2025',
    gap: 'Gap 4 volume',
    publisherJP: 'MF Bunko J',
    publisherID: 'M&C',
    priceID: 'Rp 110.000',
    isbn: 'ISBN resmi ritel lokal',
    synopsis: 'Ruang kelas elit, strategi sosial, dan pembaruan volume yang harus mudah dibandingkan tanpa scroll panjang.',
    detailFacts: [
      { label: 'Jepang', value: 'Vol. 12' },
      { label: 'Indonesia', value: 'Vol. 8' },
      { label: 'Gap', value: '4 volume' },
      { label: 'Publisher ID', value: 'M&C' },
    ],
    coverNotes: ['Volume lokal dan Jepang dapat berbeda visual', 'Catatan pre-order ditampilkan saat tersedia', 'Cocok untuk kolektor fisik'],
    releaseNotes: ['Gap dihitung otomatis', 'Catalog watch cocok untuk kolektor', 'Data toko bisa diperluas belakangan'],
    related: ['Koleksi fisik', 'Wishlist beli', 'Notifikasi rilis'],
  },
];

export const searchIndex: SearchIndexItem[] = [
  ...animeCatalog.map((item) => ({
    kind: 'Anime',
    title: item.title,
    href: `/anime/${item.slug}`,
    summary: item.blurb,
    meta: [item.status, item.studio, item.schedule],
    tone: item.tone,
  })),
  ...mangaCatalog.map((item) => ({
    kind: 'Manga',
    title: item.title,
    href: `/manga/${item.slug}`,
    summary: item.blurb,
    meta: [item.status, item.globalChapter, item.indoChapter],
    tone: item.tone,
  })),
  ...lightNovelCatalog.map((item) => ({
    kind: 'Light Novel',
    title: item.title,
    href: `/light-novel/${item.slug}`,
    summary: item.blurb,
    meta: [item.status, item.jpVolume, item.gap],
    tone: item.tone,
  })),
];

export function getAnimeBySlug(slug: string) {
  return animeCatalog.find((item) => item.slug === slug);
}

export function getMangaBySlug(slug: string) {
  return mangaCatalog.find((item) => item.slug === slug);
}

export function getLightNovelBySlug(slug: string) {
  return lightNovelCatalog.find((item) => item.slug === slug);
}