# WibuOtaku (WO) — Spesifikasi Aplikasi Anime, Manga & Light Novel Tracker

> Dokumen ini adalah blueprint/PRD (Product Requirement Document) yang bisa langsung dipakai sebagai acuan development, baik dikerjakan sendiri, dilempar ke tim, atau dipakai sebagai prompt untuk AI coding assistant (Claude Code, dll).

---

## 1. Ringkasan Produk

**Nama:** WibuOtaku (disingkat **WO**)

**Elevator pitch:** Satu aplikasi (web + APK) tempat wibu/otaku Indonesia bisa memantau semua anime yang sedang tayang, akan tayang, dan yang sudah lama tayang; sekaligus melacak progres manga & light novel — termasuk perbandingan volume rilis Jepang vs Indonesia — dengan sistem scraping otomatis, fitur pin/wishlist, dan notifikasi rilis baru.

**Masalah yang diselesaikan:**
- Info rilisan anime/manga/LN tersebar di banyak situs (MyAnimeList, AniList, penerbit lokal seperti M&C, Elex, Haru, dll).
- Susah tahu light novel di Jepang sudah sampai volume berapa, sedangkan versi Indonesia baru sampai mana.
- Tidak ada satu tempat untuk pin/wishlist semua jenis konten (anime + manga + LN) sekaligus.
- Jadwal tayang (simulcast) dan jadwal rilis buku sering ketinggalan info.

**Target pengguna:** Wibu/otaku Indonesia — penonton anime, pembaca manga/manhwa/manhua, pembaca light novel, kolektor buku fisik terbitan lokal.

---

## 2. Tujuan & Prinsip Desain

1. **Semua-dalam-satu**: anime + manga + light novel + berita rilis lokal, tidak perlu buka banyak situs.
2. **Auto-update**: sistem scraping berjalan otomatis, admin/user tidak perlu input manual data yang sudah ada di sumber lain.
3. **Personal**: pin, wishlist, tracking progress (episode ditonton, chapter/volume dibaca) per user.
4. **Lintas platform**: satu codebase → web + APK (Android) + (opsional) iOS.
5. **Ringan & cepat**: penting karena banyak user akses dari HP dengan koneksi terbatas.

---

## 3. Fitur Utama (Functional Requirements)

### 3.1 Modul Anime
- List anime: **Sedang Tayang**, **Akan Tayang (upcoming/simulcast)**, **Sudah Tamat**, **Klasik/Lampau**.
- Filter & sort: musim (season/cour), tahun, genre, studio, status, rating, popularitas.
- Detail anime: sinopsis, jumlah episode, jadwal tayang mingguan (hari & jam WIB), studio, sumber (manga/LN/original), trailer, karakter & seiyuu.
- Kalender rilis mingguan (grid per hari, mirip "jadwal simulcast").
- Countdown episode berikutnya.

### 3.2 Modul Manga / Manhwa / Manhua
- List series dengan status: ongoing, hiatus, tamat.
- Info chapter terbaru (Jepang/global) vs chapter yang sudah terbit resmi di Indonesia (jika ada penerbit lokal).
- Info lisensi: penerbit lokal (jika ada), format (fisik/digital), platform baca legal.

### 3.3 Modul Light Novel — fitur pembeda utama
- Tracking dua kolom volume: **Volume terbaru Jepang** vs **Volume terbit di Indonesia**.
- Status gap: contoh *"Jepang: Vol. 8 (terbit 12 Jan 2026) — Indonesia: Vol. 5 (terbit 20 Feb 2025) — gap 3 volume"*.
- Info penerbit lokal (Elex Media, Haru, M&C, Shira Media, dll), tanggal rilis, harga, ISBN, link pre-order/toko.
- Status "belum ada info rilis Indonesia" ditandai jelas, dan otomatis update begitu ada berita baru masuk (lihat modul scraping).
- Cover image Jepang vs cover Indonesia (kadang beda ilustrasi).

### 3.4 Sistem Scraping & Auto-Update (Core Engine)
- Scraper terjadwal (cron/worker) yang menarik data dari beberapa sumber (lihat §5).
- Pipeline: **Scrape → Normalize → Deduplicate/Match ke entitas existing → Diff terhadap data lama → Jika ada perubahan → Update DB + trigger notifikasi**.
- Matching antar sumber pakai kombinasi judul (romaji/Indo/Jepang), ID eksternal (MAL ID, AniList ID, ISBN), dan fuzzy-matching sebagai fallback.
- Log setiap scraping run (sumber, waktu, jumlah item baru/berubah, error) untuk debugging.
- Rate limiting & caching supaya tidak kena block dari situs sumber.
- Manual override: admin bisa edit/koreksi data hasil scraping yang salah match.

### 3.5 Fitur Personal User
- **Pin**: tandai anime/manga/LN favorit agar muncul di dashboard utama.
- **Wishlist**: tandai yang mau ditonton/dibaca/dibeli nanti (beda dari pin — lebih ke "belum mulai").
- **Tracking progres**: episode terakhir ditonton, chapter/volume terakhir dibaca (manual update atau sinkron dari platform lain jika memungkinkan).
- **Notifikasi**: episode baru tayang, chapter baru terbit, volume LN Indonesia baru rilis, ada diskon/pre-order.
- **Koleksi personal**: tandai buku fisik yang sudah dimiliki (untuk kolektor).
- Rating & review pribadi per judul.

### 3.6 Discovery & Sosial (opsional, fase lanjut)
- Rekomendasi berdasarkan riwayat tonton/baca.
- Trending/most-pinned minggu ini.
- Komentar/diskusi per episode atau volume (spoiler-tag wajib).
- Share list wishlist ke teman.

### 3.7 Admin Panel
- Kelola sumber scraping (aktif/nonaktif per sumber).
- Review antrian data hasil scraping yang butuh verifikasi manual (low-confidence match).
- CRUD manual untuk data yang tidak bisa di-scrape (misal info dari media sosial penerbit).
- Statistik penggunaan.

---

## 4. Struktur Data (Data Model — garis besar)

```
User
 - id, email, username, password_hash, avatar, created_at

Anime
 - id, mal_id, anilist_id, judul_romaji, judul_jepang, judul_indo
 - sinopsis, tipe(TV/Movie/OVA), jumlah_episode, status(ongoing/completed/upcoming)
 - musim, tahun, studio[], genre[], sumber_adaptasi(manga_id/ln_id/original)
 - jadwal_tayang(hari, jam_wib), cover_url, trailer_url

Episode
 - id, anime_id, nomor, judul, tanggal_tayang, sinopsis_singkat

Manga
 - id, mal_id/anilist_id, judul_romaji, judul_jepang, judul_indo
 - tipe(manga/manhwa/manhua), status, chapter_terbaru_global
 - penerbit_lokal_id (nullable), chapter_terbit_indo, link_baca_legal[]

LightNovel
 - id, judul_romaji, judul_jepang, judul_indo
 - penerbit_jepang, volume_terbaru_jepang, tanggal_rilis_jp_terbaru
 - penerbit_lokal_id (nullable)
 - volume_terbit_indo, tanggal_rilis_indo_terbaru
 - gap_volume (computed), status_lisensi(licensed/unlicensed/rumor)
 - cover_jp_url, cover_indo_url, harga_indo, isbn, link_beli[]

Penerbit
 - id, nama, negara, website, logo

Genre / Studio / Tag  (tabel referensi many-to-many)

UserLibrary
 - id, user_id, content_type(anime/manga/ln), content_id
 - status(pin/wishlist/watching/reading/completed/dropped)
 - progress(episode_terakhir / chapter_terakhir / volume_terakhir)
 - rating_personal, catatan_personal, updated_at

Notification
 - id, user_id, tipe, content_id, pesan, is_read, created_at

ScrapeSource
 - id, nama, base_url, tipe_konten, aktif(bool), last_run_at, config(json)

ScrapeLog
 - id, source_id, waktu_mulai, waktu_selesai, item_baru, item_update, error_count, detail_log
```

---

## 5. Sumber Data / Target Scraping (contoh — cek ToS masing-masing sebelum scraping)

| Kategori | Sumber potensial | Catatan |
|---|---|---|
| Anime metadata & jadwal | AniList API (GraphQL, resmi & gratis), MyAnimeList (Jikan API — unofficial wrapper) | **Prioritaskan API resmi/publik** ini daripada scraping HTML mentah — jauh lebih stabil |
| Jadwal simulcast Indonesia | Situs streaming legal lokal (misal jadwal tayang di platform streaming), forum/Twitter komunitas | Perlu scraping HTML atau parsing sosmed |
| Manga/manhwa update | AniList/MAL untuk metadata, situs baca legal untuk status lisensi | Hati-hati jangan scrape situs baca ilegal |
| Light novel Jepang | Situs penerbit Jepang (Kadokawa, dll), listing toko buku Jepang (Amazon.co.jp, CDJapan) | Cek robots.txt / gunakan API jika ada |
| Light novel Indonesia | Website & akun sosmed penerbit lokal (Elex Media Komputindo, Haru, M&C, Shira Media, Storyside, dll), toko online (Gramedia, Shopee official store) | Sumber paling sering berubah format → butuh scraper custom per penerbit |
| Berita rilis/pre-order | RSS/sosmed penerbit, grup komunitas | Bisa pakai polling API Twitter/Instagram terbatas, atau RSS |

> **Catatan legal:** selalu cek Terms of Service tiap situs sumber. Untuk data yang tidak menyediakan API resmi, gunakan scraping yang sopan (rate-limited, identifikasi user-agent jelas, hormati robots.txt), dan pertimbangkan untuk menghubungi penerbit lokal untuk kerja sama data resmi (win-win, mereka juga butuh promosi).

---

## 6. Rekomendasi Tech Stack

### Opsi A — Web App + PWA → dibungkus jadi APK (paling praktis & cepat)
- **Frontend:** Next.js (React) + Tailwind CSS
- **Backend/API:** Next.js API routes atau backend terpisah pakai Node.js (Express/Fastify) atau Django/FastAPI (Python — cocok kalau scraping berat pakai Python)
- **Database:** PostgreSQL (relasional, cocok untuk data terstruktur seperti di atas)
- **Scraping engine:** Python (BeautifulSoup/Scrapy/Playwright untuk situs dinamis) dijalankan sebagai worker terpisah + job scheduler (cron, Celery, atau BullMQ jika Node.js)
- **Auth:** NextAuth.js / Clerk / Supabase Auth
- **Notifikasi:** Web Push API (untuk PWA) + Firebase Cloud Messaging (untuk APK)
- **Jadi APK:** PWA → dibungkus **Capacitor** (dari Ionic) atau **TWA (Trusted Web Activity)** via Bubblewrap — ini cara paling ringan mengubah web app jadi APK yang bisa didownload & terasa seperti app native.
- **Hosting:** Vercel (frontend) + Railway/Render/Supabase (backend + DB) — semua ada tier gratis untuk mulai.

### Opsi B — React Native / Flutter native app
- Kalau mau app terasa lebih "native" sejak awal (bukan web dibungkus), pakai **Flutter** (Dart) atau **React Native**, dengan backend API yang sama seperti opsi A.
- Lebih berat di development tapi performa & UX native lebih baik untuk fitur seperti notifikasi, offline mode, gesture.

**Rekomendasi untuk mulai:** Opsi A (Next.js + Capacitor). Karena butuh web dulu, dan APK bisa menyusul dari codebase yang sama tanpa nulis ulang — paling efisien untuk solo developer atau tim kecil.

---

## 7. Distribusi APK via GitHub (Download Langsung, Tanpa Play Store)

Supaya user tinggal buka repo GitHub → download `.apk` → install di HP (istilahnya **sideload**), alurnya begini:

### 7.1 Cara Kerja
1. Kode web app (Next.js) di-build jadi versi statis/PWA.
2. Dibungkus jadi APK pakai **Capacitor**.
3. Proses build APK di-otomatisasi pakai **GitHub Actions** (jalan otomatis tiap kali ada update/tag baru).
4. Hasil `.apk` di-upload otomatis ke halaman **GitHub Releases** repo tersebut.
5. User tinggal buka `github.com/username/wibuotaku/releases`, klik file `WibuOtaku-vX.X.X.apk`, download, lalu install di HP.

### 7.2 Yang Perlu Disiapkan di Repo
```
wibuotaku/
├── .github/
│   └── workflows/
│       └── build-apk.yml     ← script otomatis build APK
├── android/                   ← folder project Capacitor Android
├── src/ (Next.js app)
└── ...
```

### 7.3 Contoh Alur GitHub Actions (`build-apk.yml`)
Setiap kali push tag baru (misal `v1.0.0`), workflow otomatis akan:
1. Install dependencies (Node.js, Java/Android SDK).
2. Build web app (`npm run build`) → export static.
3. Sync ke Capacitor (`npx cap sync android`).
4. Build APK release (`./gradlew assembleRelease`).
5. Sign APK (pakai keystore yang disimpan aman di GitHub Secrets).
6. Upload APK hasil build ke **GitHub Releases** otomatis (pakai action seperti `softprops/action-gh-release`).

> Ini artinya: developer cukup `git push` dan bikin tag versi baru → dalam beberapa menit APK baru otomatis muncul di halaman Releases, siap didownload user. Tidak perlu build manual tiap update.

### 7.4 Yang Perlu Dijelaskan ke User di README
Karena APK ini tidak dari Play Store, user Android akan diminta izin **"Install dari sumber tidak dikenal" (Install unknown apps)** — ini normal, cukup dijelaskan singkat di README repo dengan screenshot langkah-langkahnya supaya tidak bikin user ragu/takut.

### 7.5 Opsional — Halaman Landing Sederhana
Selain lewat GitHub Releases langsung, bisa juga dibuatkan satu halaman web sederhana (misal di GitHub Pages) dengan tombol besar **"Download APK"** yang mengarah ke file rilis terbaru — ini lebih ramah untuk user awam yang tidak familiar dengan tampilan GitHub.

---

## 8. Struktur Halaman (Sitemap)

```
/                      → Dashboard (pinned items, rilis terbaru, rekomendasi)
/anime                 → List anime (sedang tayang/akan tayang/tamat/klasik)
/anime/[id]            → Detail anime
/manga                 → List manga/manhwa/manhua
/manga/[id]            → Detail manga
/light-novel           → List light novel
/light-novel/[id]      → Detail LN (perbandingan volume JP vs ID)
/kalender               → Kalender rilis mingguan (anime + buku)
/wishlist              → Wishlist personal
/koleksi                → Pin + progress tracking personal
/notifikasi             → Riwayat notifikasi
/search?q=              → Pencarian global
/profil                 → Profil & pengaturan user
/admin/*                → Panel admin (kelola scraping, verifikasi data)
```

---

## 9. Roadmap Bertahap (MVP → Full Product)

**Fase 1 — MVP (4–6 minggu jika serius)**
- [ ] Setup project (Next.js + DB + auth)
- [ ] Integrasi AniList/Jikan API untuk data anime dasar (list, detail, jadwal)
- [ ] Halaman list anime + detail + kalender mingguan
- [ ] Fitur pin & wishlist dasar (per user)
- [ ] Deploy web version

**Fase 2 — Manga & Light Novel**
- [ ] Model data manga & LN
- [ ] Scraper awal untuk 2–3 penerbit lokal LN (mulai manual/semi-otomatis dulu)
- [ ] Halaman perbandingan volume JP vs ID
- [ ] Tracking progress baca

**Fase 3 — Scraping Engine Otomatis**
- [ ] Bangun scraper terjadwal untuk semua sumber di §5
- [ ] Sistem matching/dedup antar sumber
- [ ] Admin panel untuk review data low-confidence
- [ ] Notifikasi otomatis saat ada update

**Fase 4 — Jadi APK & Polish**
- [ ] Ubah web jadi PWA (manifest, service worker)
- [ ] Bungkus dengan Capacitor → build APK
- [ ] Setup GitHub Actions untuk auto-build & auto-publish APK ke GitHub Releases (lihat §7)
- [ ] Push notification via FCM
- [ ] Testing di berbagai device Android
- [ ] Tulis README dengan panduan download & install APK dari GitHub Releases

**Fase 5 — Fitur Lanjutan**
- [ ] Rekomendasi personalisasi
- [ ] Fitur sosial (komentar, share list)
- [ ] Dark mode, kustomisasi tema (penting buat komunitas wibu 😄)
- [ ] Multi-bahasa (ID/EN)

---

## 10. Catatan Tambahan

- **Nama & branding:** pikirkan nama yang catchy sebelum publish (cek ketersediaan domain & nama di Play Store).
- **Monetisasi (opsional):** afiliasi link pembelian buku (Gramedia/Shopee), ads non-intrusive, atau fitur premium (tanpa iklan, tracking lebih detail).
- **Skala data:** mulai dari cakupan terbatas dulu (misal fokus LN + anime musim ini) baru scale up ke database besar, supaya tidak overwhelmed di awal.
- **Komunitas:** pertimbangkan buka server Discord/grup untuk early user kasih feedback — komunitas wibu Indonesia biasanya aktif dan vokal, ini aset besar buat validasi fitur.

---

*Dokumen ini bisa langsung dipakai sebagai starting prompt untuk Claude Code atau tim development untuk mulai membangun proyek.*