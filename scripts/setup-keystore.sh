#!/usr/bin/env bash
#
# setup-keystore.sh — Generate Android keystore untuk signing APK release
#
# Cara pakai:
#   chmod +x scripts/setup-keystore.sh
#   ./scripts/setup-keystore.sh
#
# Setelah selesai, ikuti petunjuk di output untuk menambah GitHub Secrets.

set -euo pipefail

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║       WibuOtaku — Keystore Generator                 ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# ─── Konfigurasi ──────────────────────────────────────────
KEYSTORE_DIR="android/app"
KEYSTORE_FILE="${KEYSTORE_DIR}/keystore.jks"
KEYSTORE_PASSWORD=""
KEY_ALIAS=""
KEY_PASSWORD=""
VALIDITY_DAYS=10000  # ~27 tahun

# ─── Cek Java tersedia ────────────────────────────────────
if ! command -v keytool &>/dev/null; then
    echo "❌ Error: 'keytool' tidak ditemukan."
    echo "   Pastikan Java JDK sudah terinstall."
    echo "   Coba: sudo apt install openjdk-17-jdk  (Linux)"
    echo "   Atau install dari: https://adoptium.net/"
    exit 1
fi

# ─── Input dari user ──────────────────────────────────────
read -r -p "Nama organisasi/pengembang [WibuOtaku]: " ORGANIZATION
ORGANIZATION=${ORGANIZATION:-WibuOtaku}

read -r -p "Unit organisasi [Development]: " ORG_UNIT
ORG_UNIT=${ORG_UNIT:-Development}

read -r -p "Lokasi (kota) [Jakarta]: " CITY
CITY=${CITY:-Jakarta}

read -r -p "Provinsi [DKI Jakarta]: " PROVINCE
PROVINCE=${PROVINCE:-DKI Jakarta}

read -r -p "Kode negara (2 huruf) [ID]: " COUNTRY
COUNTRY=${COUNTRY:-ID}

# ─── Generate password acak ───────────────────────────────
if command -v openssl &>/dev/null; then
    KEYSTORE_PASSWORD=$(openssl rand -base64 18)
else
    # Fallback: pakai Python (tersedia di hampir semua sistem)
    KEYSTORE_PASSWORD=$(python3 -c "import secrets, string; print(''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(24)))" 2>/dev/null) || KEYSTORE_PASSWORD=$(uuidgen 2>/dev/null | tr -d '-')
    if [ -z "$KEYSTORE_PASSWORD" ]; then
        echo "⚠️  Tidak bisa generate password acak. Install openssl atau python3."
        exit 1
    fi
fi
KEY_PASSWORD="${KEYSTORE_PASSWORD}"

# ─── Nama alias ───────────────────────────────────────────
KEY_ALIAS="wibuotaku-release-key"

echo ""
echo "📦 Generating keystore..."
echo "   File:     ${KEYSTORE_FILE}"
echo "   Alias:    ${KEY_ALIAS}"
echo "   Valid:    ${VALIDITY_DAYS} hari (~27 tahun)"
echo ""

# ─── Generate keystore ────────────────────────────────────
keytool -genkey -v \
    -keystore "${KEYSTORE_FILE}" \
    -alias "${KEY_ALIAS}" \
    -keyalg RSA \
    -keysize 2048 \
    -validity "${VALIDITY_DAYS}" \
    -storepass "${KEYSTORE_PASSWORD}" \
    -keypass "${KEY_PASSWORD}" \
    -dname "CN=${ORGANIZATION}, OU=${ORG_UNIT}, L=${CITY}, ST=${PROVINCE}, C=${COUNTRY}" \
    2>&1

echo ""
echo "✅ Keystore berhasil dibuat!"
echo "   Lokasi: ${KEYSTORE_FILE}"

# ─── Encode ke base64 ─────────────────────────────────────
if command -v base64 &>/dev/null; then
    if [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "cygwin"* ]]; then
        # Windows (Git Bash)
        KEYSTORE_BASE64=$(base64 -w 0 "${KEYSTORE_FILE}" 2>/dev/null || base64 "${KEYSTORE_FILE}")
    else
        # Linux / macOS
        KEYSTORE_BASE64=$(base64 -w 0 "${KEYSTORE_FILE}" 2>/dev/null || base64 -b 0 "${KEYSTORE_FILE}" || base64 < "${KEYSTORE_FILE}")
    fi
else
    echo ""
    echo "⚠️  'base64' tidak ditemukan. Gunakan tool lain untuk encode file."
    exit 1
fi

# ─── Tampilkan output ─────────────────────────────────────
echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   Tambahkan Secrets ini ke GitHub Repository         ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "Buka: https://github.com/[username]/wibuotaku/settings/secrets/actions"
echo ""
echo "─── Tambahkan 4 secrets berikut ───"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  NAMA SECRET:         KEYSTORE_FILE_BASE64"
echo "  VALUE:               (copy baris di bawah ini)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "${KEYSTORE_BASE64}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  NAMA SECRET:         KEYSTORE_PASSWORD"
echo "  VALUE:               ${KEYSTORE_PASSWORD}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  NAMA SECRET:         KEY_ALIAS"
echo "  VALUE:               ${KEY_ALIAS}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  NAMA SECRET:         KEY_PASSWORD"
echo "  VALUE:               ${KEY_PASSWORD}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "─── Catatan ───"
echo "  • File keystore (.jks) sudah tersimpan di: ${KEYSTORE_FILE}"
echo "  • Jangan commit file ini! Sudah di .gitignore?"
echo "  • Simpan password di tempat aman (password manager)."
echo "  • Gunakan tag baru untuk trigger build signed APK:"
echo "      git tag v1.0.0"
echo "      git push origin v1.0.0"
echo ""
