# Panduan Setup Hardware & Wiring (Raspberry Pi)

Dokumen ini berisi panduan untuk menghubungkan sensor fisik ke Raspberry Pi dan menjalankan sistem dalam mode hardware serius (non-simulasi).

## 1. Komponen yang Dibutuhkan
1.  **Raspberry Pi** (3B, 4, 5, atau Zero 2W)
2.  **Sensor MLX90614** (Suhu Tubuh Non-Kontak)
3.  **Sensor MAX30102** (Heart Rate & SpO2)
4.  **Kabel Jumper** (Female-to-Female)
5.  **Breadboard** (Opsional, untuk mempermudah pembagian jalur Power/GND)

---

## 2. Wiring Diagram (I2C Bus)

Kedua sensor menggunakan protokol **I2C**, sehingga keduanya dihubungkan ke pin yang sama di Raspberry Pi.

| Raspberry Pi Pin | Fungsi | Sensor MLX90614 | Sensor MAX30102 |
| :--- | :--- | :--- | :--- |
| **Pin 1 (3.3V)** | Power | VCC | VCC |
| **Pin 6 (GND)** | Ground | GND | GND |
| **Pin 3 (SDA)** | Data | SDA | SDA |
| **Pin 5 (SCL)** | Clock | SCL | SCL |

> **PERINGATAN:** Jangan hubungkan sensor ke Pin 2 atau 4 (5V) karena dapat merusak pin GPIO Raspberry Pi yang hanya mendukung 3.3V.

---

## 3. Konfigurasi Raspberry Pi

### A. Aktifkan Interface I2C
1. Buka terminal Raspberry Pi.
2. Jalankan perintah: `sudo raspi-config`
3. Pilih **Interface Options** -> **I2C** -> **Yes**.
4. Restart Raspberry Pi: `sudo reboot`

### B. Cek Koneksi Sensor
Pastikan sensor terdeteksi di bus I2C dengan menjalankan:
```bash
sudo apt-get install i2c-tools
i2cdetect -y 1
```
*   **Alamat MLX90614**: Biasanya `0x5a`
*   **Alamat MAX30102**: Biasanya `0x57`
Jika alamat ini muncul di tabel, berarti wiring Anda sudah benar.

---

## 4. Instalasi Library Python

Pastikan Anda berada di dalam virtual environment (`.venv`) sebelum menginstal:

```bash
# Instal library pendukung I2C
pip install board busio adafruit-circuitpython-mlx90614

# Instal library MAX30102 (Gunakan versi yang kompatibel dengan library Anda)
pip install py-max30102
```

---

## 5. Cara Menjalankan

1. Hubungkan semua sensor sesuai wiring di atas.
2. Masuk ke folder server: `cd Software/server`
3. Jalankan server: `python -m uvicorn main:app --reload`
4. Jika muncul pesan `✅ Sensor ... terdeteksi`, sistem siap digunakan.

---

## Troubleshooting
*   **Sensor tidak terdeteksi?** Cek kembali kabel SDA/SCL, jangan sampai tertukar.
*   **Error I/O?** Pastikan kabel GND terpasang dengan kuat.
*   **Data Suhu Tidak Akurat?** Pastikan sensor MLX90614 menghadap ke objek (dahi/tangan) dengan jarak 2-5 cm.
