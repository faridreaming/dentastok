# DentaStok

Versi web dari mockup **DentaStok**, toko daring bahan habis pakai untuk laboratorium dan klinik gigi di Medan. Dibuat untuk mata kuliah Praktik E-Commerce (PLMKK702), Politeknik Negeri Medan.

Situs: https://faridreaming.github.io/dentastok/

## Halaman

| No | Halaman | Berkas |
|----|---------|--------|
| 01 | Beranda | `index.html` |
| 02 | Katalog Produk | `katalog.html` |
| 03 | Detail Produk | `produk.html` |
| 04 | Keranjang | `keranjang.html` |
| 05 | Checkout | `checkout.html` |
| 06 | Riwayat Pesanan dan Pesan Ulang | `riwayat.html` |
| 07 | Masuk | `masuk.html` |
| 08 | Daftar | `daftar.html` |
| 09, 10 | Tulis Ulasan (wajib dengan foto) | `ulasan.html` |
| 11 | Ulasan Terkirim | `ulasan-terkirim.html` |
| 12 | Pembayaran Berhasil | `pembayaran-berhasil.html` |

Alur belanja: Masuk, Beranda, Katalog, Detail Produk, Keranjang, Checkout, Pembayaran Berhasil.
Alur ulasan: Riwayat Pesanan, Tulis Ulasan (unggah foto), Ulasan Terkirim.

## Teknologi

HTML, CSS, dan JavaScript biasa tanpa framework dan tanpa proses build, jadi bisa langsung di-hosting di GitHub Pages.

- `css/style.css`: token warna, tipografi, dan komponen bersama (header, footer, tombol, kartu produk, meter stok).
- `css/<halaman>.css`: gaya khusus tiap halaman.
- `js/site.js`: header, footer, pencarian, dan tombol tambah ke keranjang.
- `js/<halaman>.js`: interaksi khusus halaman (jumlah barang, tab, unggah foto ulasan).
- Huruf IBM Plex Sans dan IBM Plex Mono disimpan sendiri di `assets/fonts` (lisensi SIL Open Font License).

Data produk, harga, dan stok adalah data contoh. Formulir hanya simulasi dan tidak mengirim data ke mana pun.

## Menjalankan di komputer

```bash
python3 -m http.server 8000
```

Lalu buka http://localhost:8000.

## Desain

Desain mengikuti mockup high fidelity di Figma (halaman "3. Mockup (High Fidelity)"): IBM Plex Sans, hijau DentaStok `#1B5E45` hanya untuk aksi dan stok tersedia, permukaan dipisahkan garis tipis tanpa bayangan.

Muhammad Farid Yamin, 2305181063, TRPL-7C.
