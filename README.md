# HK Tracker

Aplikasi housekeeping: upload Task Sheet Opera, timer Start/Pause/Finish per kamar, verifikasi supervisor, notifikasi tamu menunggu (queue), dan laporan durasi.

**Buka aplikasi:** https://itmjgs.github.io/hk-tracker/

## Cara kerja

- Repository ini hanya berisi **tampilan** (`index.html`) yang di-host oleh GitHub Pages.
- Login, data kamar, dan pengguna diproses oleh **Google Apps Script** dan disimpan di **Google Sheets** milik hotel. Tidak ada password atau data tamu di repository ini.
- Alamat server diatur di `index.html`, pada baris `window.HK_API_URL = '…/exec'`. Jika membuat deployment Apps Script baru (URL berubah), ganti alamat itu lalu commit.

## Memperbarui server tanpa mengganti link

Di editor Apps Script: **Deploy → Manage deployments → pensil → Version: New version → Deploy**. URL `/exec` tetap sama, jadi link GitHub ini tidak perlu diubah.

## Pindah ke aplikasi baru (halaman Terima Kasih)

Pengaturan ada di file `pindah.json`:

```json
{
  "aktif": false,
  "url": "https://hktracker.mjgs.my.id",
  "judul": "Terima Kasih",
  "pesan": "…",
  "dari": "Aldifi",
  "alihkan_detik": 0
}
```

- **Mengaktifkan:** ubah `"aktif": false` menjadi `"aktif": true`, lalu commit. Semua yang membuka link ini akan melihat halaman `terima-kasih.html` (beranimasi). HP yang sedang membuka aplikasi akan pindah otomatis dalam ±1–2 menit.
- `url`: alamat aplikasi baru. Jika diisi, muncul tombol **Buka aplikasi baru**.
- `dari`: nama pengirim yang tampil di bawah ucapan (kosongkan untuk menyembunyikan).
- `alihkan_detik`: jika lebih dari 0, pengguna otomatis dialihkan ke `url` setelah sekian detik (0 = tidak dialihkan).
- **Kembali memakai aplikasi ini:** ubah lagi menjadi `"aktif": false`, lalu commit. Halaman terima kasih yang sedang terbuka akan kembali ke aplikasi sendiri dalam ±1 menit. Data di Google Sheets tidak dihapus, jadi aplikasi bisa langsung dipakai lagi.
