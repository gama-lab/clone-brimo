# Clone BRImo Android (Mobile-First Prototype)

Aplikasi prototipe frontend interaktif yang dibuat **sama persis dengan UI/UX aplikasi resmi BRImo Android (versi terbaru)** berdasarkan tangkapan layar referensi terbaru dan data mutasi rekening nyata.

## ✨ Pembaruan & Fitur Terbaru

### 1. 📷 Scanner QRIS Interaktif dengan Kamera Nyata & Deteksi Barcode
- **Kamera Langsung (*Live Camera Stream*):** Menggunakan `navigator.mediaDevices.getUserMedia` untuk menampilkan feed kamera asli di dalam jendela viewfinder.
- **Viewfinder Presisi:** Kotak pemindai `270px x 270px` dengan sudut siku putih tebal 4 sisi dan animasi sinar laser pemindai.
- **Unggah Gambar dari Galeri dengan Validasi Real-time:**
  - **Jika BUKAN Barcode/QR Code:** Sistem langsung menampilkan dialog gagal: *"QR Code Tidak Ditemukan. Gambar yang Anda pilih tidak mengandung kode QR/Barcode yang valid."*
  - **Jika ADALAH Barcode/QR Code:** Sistem menampilkan animasi loading verifikasi berkelanjutan (*"Memproses QRIS..."*), lalu memunculkan dialog pemeliharaan khas BRImo: *"Sistem Sedang Dalam Pemeliharaan (Kode: BND-01) - Mohon maaf, saat ini fitur transaksi QRIS sedang dalam peningkatan kualitas sistem berkala."*
- **Simulasi Transaksi Cepat:** Mengetuk kotak pemindai langsung membuka halaman *Scan QRIS: Masukkan Nominal* (`Jafar - Scan DANA`), lalu menuju resi transaksi resmi.

### 2. 💰 Mutasi Transfer Masuk Rp 1.550.000 dari Asehpryanto
- **Data Mutasi Terkini:**
  - **Pengirim:** `Asehpryanto Rari Parinding`
  - **Bank Pengirim:** `BANK NEGARA INDONESIA (BNI)`
  - **No. Rekening:** `1491601822` (sama persis dengan data riwayat pada baris 46 & 129 di file e-Statement)
  - **Nominal:** `+ Rp 1.550.000`
  - **Keterangan:** `Transfer BI-Fast dari BANK NEGARA INDONESIA - PT (PERSERO - 1491601822 - Asehpryanto Rari Parinding`
  - **Saldo Rekening Akhir:** `Rp 1.550.000,00`

### 3. 📬 Tab Aktivitas (Hanya Uang Keluar & Klik Buka Struk Asli)
- Transaksi masuk disaring sehingga daftar tab Aktivitas murni hanya menampilkan transaksi pengeluaran (uang keluar).
- Mengetuk transaksi manapun langsung membuka **Struk Bukti Transaksi Digital Resmi** berlubang (*perforated ticket*) dengan badge centang `Transaksi Berhasil`, `Produk Pilihan Untukmo`, dan tombol `Bagikan` / `Selesai`.

### 4. 🔘 Navbar Bawah & Logo BRImo
- Tombol tengah **QRIS** floating dengan 4 sudut siku putih dan tulisan tebal **`QRIS`** di tengahnya.
- Teks logo `BRI` di atas dan `mo` berwarna biru langit (*sky blue `#38BDF8`*) di bawahnya.
- Murni Web App (PWA Standalone ready) tanpa bingkai HP tiruan.
