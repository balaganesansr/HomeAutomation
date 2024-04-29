#include <HTTPClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>
const char* ssid = "Bala";
const char* password = "12345678";
const char* firebaseHost = "raspberry-mz-default-rtdb.firebaseio.com";
const char* firebasePath = "/status.json?auth=UhSBc3hxpo6leXPDZwHyaDiE5goosuj48eSNe31Y";
const int ledPin = 2;
void setup() {
  Serial.begin(9600);
  delay(1000);
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
}
void loop() {
 
  int value = getValueFromFirebase();
 
  if (value == 1) {
    Serial.println("Value is 1. Turning on the LED.");
    digitalWrite(ledPin, HIGH);
  } else {
    Serial.println("Value is not 1. Turning off the LED.");
    digitalWrite(ledPin, LOW);
  }
 
  delay(1000);
}
int getValueFromFirebase() {
  Serial.println("Sending HTTP request to Firebase...");
  HTTPClient http;
  String url = "https://" + String(firebaseHost) + firebasePath;
  http.begin(url);
  int httpResponseCode = http.GET();
  if (httpResponseCode == HTTP_CODE_OK) {
    String response = http.getString();
    Serial.println("Response: " + response);
   
    DynamicJsonDocument jsonDoc(1024);
    DeserializationError error = deserializeJson(jsonDoc, response);
    if (error) {
      Serial.println("Failed to parse JSON");
      return -1;
    }
   
    int value = jsonDoc["ISON"];
    return value;
  } else {
    Serial.print("Failed to get response. HTTP error code: ");
    Serial.println(httpResponseCode);
    return -1;
  }
  http.end();
}
