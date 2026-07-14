# WibuOtaku (WO)

> Anime, manga, dan light novel tracker untuk pengguna Indonesia.

Satu aplikasi (web + APK) tempat wibu/otaku Indonesia bisa memantau semua anime yang sedang tayang, melacak progres manga & light novel — termasuk perbandingan volume rilis Jepang vs Indonesia.

---

## 🚀 Mulai Cepat

```bash
npm install
npm run dev        # development server di http://localhost:3000
npm run build      # build static untuk production
```

## 📲 Download APK

APK bisa didownload langsung dari **GitHub Releases** (tanpa Play Store):

1. Buka [halaman download](https://username.github.io/wibuotaku) atau [GitHub Releases](https://github.com/username/wibuotaku/releases) *(ganti `username` dengan GitHub username kamu)*
2. Klik tombol **Download APK**
3. Buka file `.apk` di HP Android
4. Izinkan **"Install dari sumber tidak dikenal"** (bila diminta)
5. Selesai! Aplikasi siap dipakai.

> **Catatan:** APK ini tidak melalui Play Store, jadi Android akan meminta izin sideload. Ini normal dan aman — source code terbuka di repo ini.

> 💡 **Landing page:** kunjungi [username.github.io/wibuotaku](https://username.github.io/wibuotaku) *(ganti `username`)* untuk halaman download yang lebih ramah pengguna.

## 🧱 Tech Stack

| Lapisan | Teknologi |
|---------|-----------|
| Frontend | Next.js 15 + React 19 + Tailwind CSS |
| Data Anime/Manga | AniList API (GraphQL) |
| Data LN Indonesia | **Scraper otomatis** via cheerio (Elex, Haru, M&C) + static fallback |
| PWA | Service Worker + Manifest |
| APK | Capacitor (Android) |
| CI/CD | GitHub Actions (auto-build APK + scrape LN) |

## 🕷️ Scraping Light Novel

Data Light Novel Indonesia diambil otomatis dari katalog penerbit lokal:

| Penerbit | Sumber | Metode |
|----------|--------|--------|
| **Elex Media** | [elexmedia.id](https://elexmedia.id/catalogs) | HTML scrape via cheerio |
| **Penerbit Haru** | [penerbitharu.com](https://www.penerbitharu.com/koleksi-buku) | HTML scrape via cheerio |
| **M&C Gramedia** | [mncgramedia.id/books/light-novel](https://mncgramedia.id/books/light-novel) | HTML scrape via cheerio |

### Cara Kerja

```bash
# 1. Scrape semua publisher
npm run scrape

# atau step-by-step:
npm run scrape:publishers   # fetch data dari website publisher
npm run scrape:normalize    # normalisasi + dedup → data/scraped/ln-catalog.json
```

Data hasil scraping otomatis dipakai oleh halaman Light Novel saat build. Jika data tidak tersedia, fallback ke data statis di `site-data.ts`.

### Jadwal Scraping Otomatis (CI/CD)

GitHub Actions menjalankan scraper **setiap hari Sabtu jam 08:00 WIB** dan membuat Pull Request jika ada perubahan data.

Trigger manual:
1. Buka GitHub → Actions → **Scrape LN Publishers**
2. Klik **Run workflow**

## 🗺️ Sitemap

| Route | Halaman |
|-------|---------|
| `/` | Dashboard (pinned items, rilis terbaru) |
| `/anime` | List anime |
| `/anime/[id]` | Detail anime |
| `/manga` | List manga |
| `/manga/[id]` | Detail manga |
| `/light-novel` | List light novel |
| `/light-novel/[id]` | Detail LN (JP vs ID volume) |
| `/kalender` | Kalender rilis mingguan |
| `/wishlist` | Wishlist personal |
| `/koleksi` | Koleksi & progress |
| `/notifikasi` | Riwayat notifikasi |
| `/search` | Pencarian global |
| `/profil` | Profil & pengaturan tema |
| `/admin` | Panel admin |

## 🎨 Fitur

- **🌙 Dark/Light mode** — toggle di navbar, persist ke localStorage
- **🎨 8 accent colors** — Gold, Blue, Rose, Hijau, Ungu, Cyan, Pink, Oranye
- **📱 PWA-ready** — bisa di-install ke home screen HP
- **⚡ AniList API** — data anime & manga real-time
- **📊 Visual gap LN** — perbandingan volume Jepang vs Indonesia

## 📦 Build APK Manual

```bash
npm run build
npx cap sync android
npx cap open android    # buka di Android Studio
# lalu Build → Build APK
```

Atau biarkan **GitHub Actions** yang build otomatis tiap kali push tag `v*`.

## 🔐 Setup Keystore (Signing Key)

Untuk build APK **release yang signed** (bisa diinstall tanpa uninstall versi lama), setup keystore dan GitHub Secrets:

### 1. Generate Keystore

Jalankan script generator:

```bash
chmod +x scripts/setup-keystore.sh
./scripts/setup-keystore.sh
```

Script ini akan:
- Membuat file `android/app/keystore.jks`
- Menampilkan 4 nilai secret yang perlu ditambahkan ke GitHub

### 2. Tambahkan Secrets ke GitHub

Buka repo → **Settings → Secrets and variables → Actions** → tambahkan 4 secrets:

| Secret Name | Value |
|---|---|
| `KEYSTORE_FILE_BASE64` | Output base64 dari script (isi file .jks yang diencode) |
| `KEYSTORE_PASSWORD` | Password keystore (dari output script) |
| `KEY_ALIAS` | `wibuotaku-release-key` (dari output script) |
| `KEY_PASSWORD` | Key password (sama dengan keystore password) |

### 3. Test Build Signed APK

Buat tag dan push untuk trigger GitHub Actions:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Workflow akan:
1. Build Next.js → static export
2. Sync ke Capacitor
3. **Sign APK otomatis** pakai keystore dari secrets
4. Upload ke GitHub Releases

> APK yang **signed** bisa diinstall sebagai **update** (tidak perlu uninstall dulu).
> APK **debug** tetap bisa dihasilkan tanpa keystore (tapi harus uninstall versi debug sebelumnya).

## 🔄 CI/CD

Push tag baru akan otomatis:
1. Build Next.js static export
2. Sync ke Capacitor
3. Sign APK dengan keystore (jika secrets dikonfigurasi) atau build debug APK
4. Upload ke GitHub Releases

```bash
git tag v1.0.0
git push origin v1.0.0
```

## 📄 Lisensi

MIT
