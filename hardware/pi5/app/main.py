from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

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
def open_door():
    print("Received open door request (HTTP)")
    # TODO: Dodaj komendę otwierającą drzwi przez GPIO lub ESP32
    return {"status": "success", "message": "Door opening triggered"}

if __name__ == "__main__":
    import uvicorn 
    uvicorn.run(app, host="0.0.0.0", port=5000)
