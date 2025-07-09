from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from schemas import rooms
import requests

def send_to_esp32(room_data: rooms.RoomAccessCodeOut):
    esp_ip = "192.168.1.24"  # Zastąp IP ESP32
    url = f"http://{esp_ip}/{room_data.room_id}"
    response = requests.post(url, json=room_data.dict())
    print("ESP32 odpowiedziało:", response.text)
    
app = FastAPI(
    title="Eduaccess RPi API",
    version="1.0",
    root_path="/eduaccess/v1/rpi"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Zmodyfikuj, jeśli chcesz tylko konkretne IP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"message": "Welcome to eduaccess RPi API"}

@app.post("/open-door")
def open_door(
    room_data: rooms.RoomAccessCodeOut
):
    send_to_esp32(room_data)
    return {"status": "success", "message": "Door opening triggered"}

if __name__ == "__main__":
    import uvicorn 
    uvicorn.run(app, host="0.0.0.0", port=5000)
