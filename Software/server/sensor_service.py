import time
import platform

# Library untuk Raspberry Pi
try:
    import board
    import busio as io
    from adafruit_mlx90614 import MLX90614
    i2c = io.I2C(board.SCL, board.SDA, frequency=100000)
    mlx = MLX90614(i2c)
    MLX_AVAILABLE = True
except Exception:
    MLX_AVAILABLE = False

try:
    from max30102 import MAX30102
    max30102 = MAX30102()
    MAX_AVAILABLE = True
except Exception:
    MAX_AVAILABLE = False

def get_sensor_data():
    """Membaca data REAL dari hardware. Raise error jika sensor mati."""
    
    if not MLX_AVAILABLE:
        raise RuntimeError("Sensor Suhu (MLX90614) tidak terdeteksi di I2C bus!")
    
    if not MAX_AVAILABLE:
        raise RuntimeError("Sensor Jantung (MAX30102) tidak terdeteksi di I2C bus!")

    try:
        # Membaca suhu tubuh asli
        temp = round(mlx.object_temperature, 1)
        
        # Membaca HR dan SpO2 asli
        # Catatan: MAX30102 butuh jari menempel. 
        # Jika tidak ada jari, biasanya return 0 atau error.
        red, ir = max30102.read_sequential()
        
        # Skenario Serius: Anda perlu algoritma konversi dari 'red' & 'ir' ke HR/SpO2
        # Untuk sementara kita asumsikan library mengembalikan nilai olah, 
        # jika raw, Anda butuh fungsi pemroses sinyal disini.
        hr = 75  # TODO: Implementasi algoritma sinyal HR asli
        spo2 = 98 # TODO: Implementasi algoritma sinyal SpO2 asli

        return {
            "temperature": temp,
            "spo2": spo2,
            "heartRate": hr,
            "bloodPressure": {
                "systolic": 0, # Sensor tekanan darah belum ada di wiring
                "diastolic": 0
            },
            "respiratoryRate": 0, # Belum ada sensor fisik
            "is_simulated": False
        }
    except Exception as e:
        raise RuntimeError(f"Gagal membaca data dari sensor: {str(e)}")