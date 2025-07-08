import requests

def notify_rpi_open_door():
    try:
        response = requests.post("http://192.168.1.21:5000/eduaccess/v1/rpi/open-door")
        # tu sie sprawdzi czy drzwi sie otworzyly itp
        print("RPI response:", response.json())
    except Exception as e:
        print(f"Failed to trigger door opening: {e}")
