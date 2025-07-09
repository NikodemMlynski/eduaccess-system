from machine import Pin
import time
import network
import socket
import ujson
from lcd1602 import LCD1602_4bit

# --- Stałe ---
ROOM_ID = 16
ROOM_NAME = "Sala 115A"

# --- Inicjalizacja LCD ---
lcd = LCD1602_4bit(rs=15, e=2, d4=4, d5=5, d6=18, d7=19)
lcd.clear()
lcd.write(0, 0, ROOM_NAME[:16])

# --- Połączenie z Wi-Fi ---
ssid = ''
password = ''

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

print("Łączenie z WiFi...", end="")
while not wlan.isconnected():
    time.sleep(1)
    print(".", end="")
print("\nPołączono! IP:", wlan.ifconfig()[0])

# --- Serwer ---
addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]

s = socket.socket()
s.bind(addr)
s.listen(1)

print(f"ESP32 nasłuchuje na http://{wlan.ifconfig()[0]}/{ROOM_ID}")

while True:
    cl, addr = s.accept()
    print('Połączenie od', addr)

    request = cl.recv(1024)
    request_str = request.decode()
    print("Odebrano żądanie:\n", request_str)

    if f"POST /" in request_str:
        try:
            body = request_str.split("\r\n\r\n")[1]
            data = ujson.loads(body)

            access_code = data.get("access_code", "BRAK")
            print("ODEBRANE DANE:")
            print("room_id:", data.get("room_id"))
            print("access_code:", access_code)
            print("room_name:", data.get("room_name"))

            # --- Aktualizacja wyświetlacza ---
            lcd.write(0, 0, ROOM_NAME[:16])         # Górna linia: nazwa sali (zawsze taka sama)
            lcd.write(0, 1, access_code[:16])       # Dolna linia: kod dostępu (z requesta)

            response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nKod odebrany poprawnie"

        except Exception as e:
            print("Błąd przy parsowaniu JSON:", e)
            response = "HTTP/1.1 400 Bad Request\r\nContent-Type: text/plain\r\n\r\nBłąd w danych JSON"
    else:
        response = "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\n\r\nZły adres lub metoda"

    cl.send(response)
    cl.close()
