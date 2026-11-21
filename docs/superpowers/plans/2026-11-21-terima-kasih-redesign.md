# Redesign Halaman Terima Kasih Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengganti tampilan `terima-kasih.html` dengan animasi "pintu terbuka → jalan → rumah baru" bernuansa toska + emas hangat.

**Architecture:** Satu file HTML statis (CSS + SVG inline + JS vanilla). Adegan SVG dianimasikan dengan CSS keyframes; confetti/kilau dengan canvas. Konten tetap dibaca dari `pindah.json` dengan logika yang sudah ada.

**Tech Stack:** HTML/CSS/JS vanilla, Google Fonts (Playfair Display, Inter) dengan fallback sistem; uji dengan Playwright (Chromium pra-terpasang) lewat Node.

**Spec:** `docs/superpowers/specs/2026-11-21-terima-kasih-redesign-design.md`

## Global Constraints
- Tanpa library JS. Satu file `terima-kasih.html`.
- Teks: judul "Terima Kasih"; pesan "HK Tracker sudah pindah ke aplikasi baru. Terima kasih sudah menjadi bagian dari pengembangan aplikasi ini!"; nama "Aldifi" (tanpa "—", tanpa "Salam hangat"); tombol "Buka aplikasi baru" → `https://hktracker.mjgs.my.id`; tanpa footer.
- Tombol terlihat ≤ 3,5 detik setelah halaman dibuka.
- `prefers-reduced-motion: reduce` → semua konten langsung terlihat, tanpa confetti.
- Kontras teks ≥ 4.5:1; fokus keyboard terlihat pada tombol; ikon SVG, bukan emoji.
- Tidak ada scroll horizontal pada lebar 360px; isi muat tanpa scroll vertikal pada 390×844.
- Logika `pindah.json` (aktif/url/judul/pesan/dari/alihkan_detik, cek tiap 60 dtk, kembali ke `./` saat aktif=false) dipertahankan apa adanya.

## Review Focus
- Font Google gagal dimuat (offline/diblokir) → halaman tetap rapi dengan font sistem.
- Layar pendek (HP landscape 844×390) → konten tetap bisa diakses (boleh scroll), tombol tidak terpotong.
- `pindah.json` tanpa `dari` → tanda tangan disembunyikan tanpa celah aneh.
- `url` kosong → tombol tidak muncul, animasi tetap selesai dengan rapi.
- Pengguna dengan reduce-motion → tidak ada elemen yang tertinggal transparan (opacity 0).

---

### Task 1: Uji otomatis + halaman baru

**Files:**
- Create: `tests/terima-kasih.test.js`
- Modify: `terima-kasih.html` (tulis ulang tampilan; blok `<script>` pindah.json dipertahankan)

**Interfaces:**
- Produces: elemen `#judul`, `#pesan`, `#sign` berisi `#dari`, `#actions` berisi `a#go`, `#count`, `canvas#fx`, `svg#scene` (adegan pintu→rumah).

- [ ] **Step 1: Tulis uji** `tests/terima-kasih.test.js` (Node + `require('playwright')`, jalankan server statis `python3 -m http.server` di port acak, cegat `pindah.json` dengan `page.route`). Kasus & assert:
  1. `normal`: viewport 390×844; setelah 3500 ms `#go` visible, href `https://hktracker.mjgs.my.id`; `#dari` teks `Aldifi`; `#pesan` berisi `sudah pindah ke aplikasi baru`; `svg#scene` ada; `document.body.innerText` tidak memuat `—`, `Salam hangat`, `Housekeeping`; `scrollWidth <= clientWidth` pada lebar 360.
  2. `reduced`: `reducedMotion:'reduce'`; setelah 300 ms `#go` visible dan opacity computed `#judul`/`#go` = `1`.
  3. `noDari`: json tanpa `dari` → `#sign` hidden.
  4. `noUrl`: `url:""` → `#actions` hidden.
  5. `noFonts`: blok `fonts.googleapis.com`/`fonts.gstatic.com` → kasus normal tetap lolos.
  6. `landscape`: 844×390 → `#go` bisa di-scroll ke tampilan dan visible.
  Simpan screenshot `normal` (DPR 2) ke `$SHOT_DIR` bila di-set. Keluar kode 1 jika ada kegagalan.
- [ ] **Step 2: Jalankan** `node tests/terima-kasih.test.js` — Expected: FAIL pada `svg#scene` (belum ada).
- [ ] **Step 3: Tulis ulang tampilan `terima-kasih.html`** sesuai spec bagian Desain: SVG `#scene` (pintu kiri membuka + cahaya emas, jalan putus-putus tergambar `stroke-dashoffset`, rumah kanan muncul dengan jendela menyala & centang), kartu kaca (`backdrop-filter: blur`), judul Playfair gradasi toska-emas, tanda tangan emas, tombol toska dengan panah bergerak + denyut. Timeline: adegan 0–2,2 s, teks 2,2–3 s, tombol + confetti ±3 s. Token warna di `:root` (`--bg:#0b2a29`, `--bg2:#123d3b`, `--accent:#78cfc4`, `--gold:#f2c46d`, `--text:#eaf7f5`, `--muted:#b9dbd6`). `:focus-visible` pada tombol dengan outline emas 3px.
- [ ] **Step 4: Jalankan** `node tests/terima-kasih.test.js` — Expected: semua 6 kasus PASS; periksa screenshot.
- [ ] **Step 5: Commit** `git add tests/terima-kasih.test.js terima-kasih.html && git commit -m "Redesign halaman Terima Kasih: animasi pintu menuju rumah baru"`
