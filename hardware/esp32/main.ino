#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>

const char* ssid = "nazwa_wifi";
const char* password = "haslo_wifi";

WebServer server(80);

Servo myServo;
int servoPin = 25;
int ledPin = 26;

void handleOpen() {
  myServo.write(180);
  server.send(200, "text/plain", "Servo opened");
  digitalWrite(ledPin, HIGH);
}

void handleClose() {
  myServo.write(0);
  server.send(200, "text/plain", "Servo closed");
  digitalWrite(ledPin, LOW);
}

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());


  myServo.attach(servoPin);
  myServo.write(0); 

  server.on("/open", handleOpen);
  server.on("/close", handleClose);

  server.begin();
}

void loop() {
  server.handleClient();
}
