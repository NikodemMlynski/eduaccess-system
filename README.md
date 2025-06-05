Inteligentny System Kontroli Dostępu dla Szkół
==============================================

📌 Opis projektu
----------------

**Inteligentny System Kontroli Dostępu dla Szkół** ma na celu automatyzację zarządzania dostępem do sal lekcyjnych za pomocą technologii rozpoznawania twarzy. System zastępuje tradycyjne karty RFID i integruje się z planem lekcji, zapewniając dynamiczne zarządzanie dostępem uczniów i nauczycieli.

⚡ Kluczowe funkcjonalności
--------------------------

### ✅ Autoryzacja twarzą

*   Raspberry Pi z kamerą rejestruje obraz i analizuje go przy użyciu **OpenCV + TensorFlow**.
    
*   Po rozpoznaniu twarzy sprawdzane są uprawnienia użytkownika w bazie danych PostgreSQL.
    

### ✅ Inteligentne zarządzanie dostępem

*   **Nauczyciele** mają dostęp do sal, w których prowadzą lekcje.
    
*   **Uczniowie** mogą wejść tylko do sal, w których mają zajęcia.
    
*   **Administrator** może ręcznie zarządzać dostępem.
    

### ✅ Sterowanie drzwiami przez ESP32

*   Po poprawnej autoryzacji Raspberry Pi wysyła **żądanie HTTP** do **ESP32**, które steruje serwomechanizmem otwierającym drzwi.
    

### ✅ Panel administratora (React + FastAPI)

*   Zarządzanie użytkownikami i ich dostępem.
    
*   Podgląd **logów wejść i wyjść**.
    
*   Przypisywanie **Raspberry Pi do konkretnych sal** i monitorowanie ich statusu.
    

### ✅ Monitorowanie i raporty

*   **Historia logowań do sal**.
    
*   **Raporty frekwencji** uczniów i nauczycieli.
    
*   **Powiadomienia** o nieautoryzowanym dostępie.
    

🛠 Środowisko uruchomieniowe
----------------------------

### 🖥 **Frontend (Panel Admina)**

*   React + TypeScript
    
*   Zustand (zarządzanie stanem)
    
*   @tanstack/react-query (zapytania do API)
    
*   shadcn/ui + lucide-react (UI)
    

### 🌐 **Backend (API + AI)**

*   FastAPI (Python) – obsługa zapytań
    
*   PostgreSQL – baza danych
    
*   OpenCV + TensorFlow – rozpoznawanie twarzy
    

### 🛠 **Mikrokontrolery i sprzęt**

*   **Raspberry Pi 5 + Kamera Pi 3 Module** – AI i autoryzacja
    
*   **ESP32** – sterowanie zamkiem drzwi
    

### 📡 **Komunikacja**

*   HTTP (REST API)
    

📡 API
------

System posiada **dwa API**:

### 🌍 **Globalne API (FastAPI)** – obsługuje całą aplikację

*   Endpointy do zarządzania użytkownikami
    
*   Historia logowań i raporty frekwencji
    
*   Przypisywanie sal do użytkowników
    
*   Obsługa autoryzacji i ról
    

### 📌 **Lokalne API (Raspberry Pi)** – obsługuje funkcje sprzętowe

*   Przetwarzanie obrazu z kamery i wykrywanie twarzy
    
*   Wysyłanie żądań otwierania drzwi do ESP32
    
*   Lokalna walidacja tożsamości
    
*   Pingowanie do serwera globalnego w celu synchronizacji

### Szczegóły
- [Bardziej szczegółowa wizja systemu](https://miro.com/app/board/uXjVIcMhBR4=/?share_link_id=677465281486)

## Instalacja projektu

### API
Jeśli nie masz Poetry, zainstaluj go
```
curl -sSL https://install.python-poetry.org | python3 -
```
Przejdź do katalogu `api` i uruchom
```
cd api
poetry install
poetry add bcrypt // z jakiegoś powodu paczka nie instaluje się razem z innymi
```
Uruchomienie servera fastapi 
- Windows
```
poetry run python -m app.main
```
- Linux / MacOs
```
poetry run python3 -m app.main
```
api powinno nasłuchiwać na `localhost:8000/eduaccess/v1`
### Frontend (Admin Panel)
Przejdź do katalogu `admin_panel` i zainstaluj zależności
```
cd admin_panel
npm install
```
Uruchom aplikacje
```
npm run dev
```

### Migracje bazy danych
utworzenie migracji
```
poetry run alembic revision --autogenerate -m "opis migracji"
```
zaaktualizowanie migracji
```
poetry run alembic upgrade head
poetry run alembic -x test=true -c alembic_test.ini upgrade head
```
