# Redesign halaman Terima Kasih (pindah aplikasi)

## Maksud
Halaman `terima-kasih.html` muncul di link lama HK Tracker saat `pindah.json` berisi `"aktif": true`.
Kesan yang diinginkan Aldifi: **semangat menuju rumah baru, tapi tetap hangat**. Staf harus langsung paham
aplikasi sudah pindah dan terdorong menekan tombol ke aplikasi baru.

## Tujuan
- Animasi bercerita "pintu terbuka → jalan → rumah baru" (±3 detik) sebelum teks muncul.
- Isi tetap: judul "Terima Kasih", pesan "HK Tracker sudah pindah ke aplikasi baru. Terima kasih sudah menjadi
  bagian dari pengembangan aplikasi ini!", nama **Aldifi** (tanpa tanda pisah, tanpa "Salam hangat"),
  tombol **Buka aplikasi baru** → https://hktracker.mjgs.my.id. Tanpa footer.
- Tombol berdenyut lembut setelah muncul (ajakan menekan).

## Bukan tujuan
- Tidak mengubah mekanisme `pindah.json` (aktif, url, judul, pesan, dari, alihkan_detik) maupun pengecekan di `index.html`.
- Tidak mengubah aplikasi utama.

## Anti-tujuan
- Animasi terlalu lama sehingga staf menunggu tombol (> ±3,5 detik).
- Terasa kartun/kekanak-kanakan, atau warna asing dari aplikasi lama.

## Batasan
- File HTML statis tunggal di GitHub Pages; tanpa library JS. Font Google (Playfair Display + Inter/Karla) boleh,
  dengan fallback sistem jika gagal dimuat.
- Harus nyaman di HP (lebar 360–430px), juga rapi di desktop.
- Checklist ui-ux-pro-max: kontras teks ≥ 4.5:1, fokus keyboard terlihat, `prefers-reduced-motion` (semua langsung
  tampil tanpa animasi), ikon SVG (bukan emoji), transisi hover 150–300ms.

## Pendekatan yang dipertimbangkan
- **A. Pintu terbuka menuju rumah baru, toska + emas hangat** — dipilih. Sama dengan warna aplikasi lama (familiar),
  makna "pindah" tampil lewat animasi.
- B. Navy + emas mewah (rekomendasi mentah ui-ux-pro-max) — elegan tapi asing dan terlalu formal.
- C. Adegan animasi penuh (gedung, mobil pindahan) — paling meriah tapi lama dan berisiko kartun.

## Desain (A)
- Latar: gradasi toska tua (#0b2a29 → #123d3b) dengan cahaya emas lembut yang "menyala" dari arah pintu, partikel kilau naik pelan.
- Adegan SVG di atas: pintu lama di kiri (terbuka, cahaya emas keluar) → garis jalan putus-putus tergambar ke kanan →
  ikon rumah baru dengan tanda centang/jendela menyala muncul dengan pantulan kecil.
- Kartu kaca transparan (blur, border tipis) berisi judul Playfair Display bergradasi toska-emas, pesan, nama Aldifi
  (emas, gaya tulisan tangan), tombol toska dengan panah yang bergerak dan denyut cahaya.
- Urutan waktu: adegan 0–2,2s, teks 2,2–3s, confetti + tombol ±3s.

## Diserahkan ke pembuat
Bentuk persis ilustrasi, kurva easing, jumlah partikel, ukuran font responsif.
