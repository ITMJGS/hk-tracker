# HK Tracker

Aplikasi housekeeping: upload Task Sheet Opera, timer Start/Pause/Finish per kamar, verifikasi supervisor, notifikasi tamu menunggu (queue), dan laporan durasi.

**Buka aplikasi:** https://itmjgs.github.io/hk-tracker/

## Cara kerja

- Repository ini hanya berisi **tampilan** (`index.html`) yang di-host oleh GitHub Pages.
- Login, data kamar, dan pengguna diproses oleh **Google Apps Script** dan disimpan di **Google Sheets** milik hotel. Tidak ada password atau data tamu di repository ini.
- Alamat server diatur di `index.html`, pada baris `window.HK_API_URL = '…/exec'`. Jika membuat deployment Apps Script baru (URL berubah), ganti alamat itu lalu commit.

## Memperbarui server tanpa mengganti link

Di editor Apps Script: **Deploy → Manage deployments → pensil → Version: New version → Deploy**. URL `/exec` tetap sama, jadi link GitHub ini tidak perlu diubah.
