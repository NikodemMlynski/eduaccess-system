# 🏫 Inteligentny System Kontroli Dostępu dla Szkół

## Read the English version: [README_EN.md](README_EN.md)

## 📋 Spis treści
1. [Opis projektu](#opis-projektu)
2. [Status projektu](#status-projektu)
3. [Kluczowe funkcjonalności](#kluczowe-funkcjonalności)
4. [Środowisko uruchomieniowe](#środowisko-uruchomieniowe)
5. [Architektura API](#api)
6. [Instalacja projektu](#instalacja-projektu)
7. [Szczegóły i dokumentacja](#szczegóły)
8. [Autorzy](#autorzy)

---

## Opis projektu

**Inteligentny System Kontroli Dostępu dla Szkół** to aplikacja mająca na celu automatyzację zarządzania dostępem do sal lekcyjnych za pomocą technologii rozpoznawania twarzy oraz aplikacji mobilnej.  
System zastępuje tradycyjne karty RFID i integruje się z planem lekcji, zapewniając dynamiczne, bezpieczne i elastyczne zarządzanie dostępem uczniów i nauczycieli.

---

## Status projektu

| Funkcjonalność | Status |
|----------------|---------|
| Autoryzacja twarzą | 🔜 W trakcie konfiguracji z ESP32 |
| Inteligentne zarządzanie dostępem | ✅ Gotowe |
| Sterowanie drzwiami przez ESP32 | ⚙️ W trakcie testów |
| Panel administratora (React + FastAPI) | ✅ Gotowe |
| Aplikacja mobilna (React Native + Expo) | ✅ Gotowa |
| Monitorowanie i raporty | ✅ Gotowe |

---

## Kluczowe funkcjonalności

### 🔐 Autoryzacja twarzą
* Raspberry Pi z kamerą analizuje obraz przy użyciu **OpenCV + TensorFlow**.  
* Po rozpoznaniu twarzy system weryfikuje uprawnienia użytkownika w bazie danych **PostgreSQL**.

### 🧠 Inteligentne zarządzanie dostępem
* **Nauczyciele** mają dostęp do sal, w których prowadzą lekcje.  
* **Uczniowie** mogą wejść tylko do sal, w których mają zajęcia.  
* **Administrator** może ręcznie modyfikować dostęp użytkowników.

### 🚪 Sterowanie drzwiami przez ESP32
* Po poprawnej autoryzacji Raspberry Pi wysyła **żądanie HTTP** do **ESP32**, które steruje serwomechanizmem otwierającym drzwi.

### 📱 Aplikacja mobilna (dla uczniów i nauczycieli)
* **Uczniowie** mogą:
  * wysyłać **żądania otwarcia sali** bezpośrednio z aplikacji,  
  * przeglądać **statystyki swojej frekwencji**,  
  * sprawdzać **swój plan lekcji**.  
* **Nauczyciele** mogą:
  * **zatwierdzać** żądania otwarcia sal wysłane przez uczniów,  
  * **zarządzać** dostępem do sal z poziomu aplikacji mobilnej.
  * **modyfikować** frekwencje uczniów, z którymi ma lekcje.

### 🧰 Panel administratora (React + FastAPI)
* Zarządzanie użytkownikami i ich dostępem.  
* Podgląd **logów wejść i wyjść**.  
* Przypisywanie **Raspberry Pi** do konkretnych sal i monitorowanie ich statusu.

### 📊 Monitorowanie i raporty
* Historia logowań do sal.  
* Raporty frekwencji uczniów i nauczycieli.  
* Powiadomienia o próbach nieautoryzowanego dostępu.

---

## Środowisko uruchomieniowe

### 🖥 Frontend (Panel Admina)
* React + TypeScript  
* Zustand (zarządzanie stanem)  
* @tanstack/react-query (zapytania do API)  
* shadcn/ui + lucide-react (UI)

### 🌐 Backend (API + AI)
* FastAPI (Python) – obsługa zapytań  
* PostgreSQL – baza danych  
* OpenCV + TensorFlow – rozpoznawanie twarzy

### 📱 Aplikacja Mobilna
* React Native + Expo  
* Zustand (zarządzanie stanem aplikacji)  
* axios – komunikacja z API  
* Kompatybilna z Android i iOS

### 🔧 Mikrokontrolery i sprzęt
* **Raspberry Pi 5 + Kamera Pi 3 Module** – rozpoznawanie twarzy i autoryzacja  
* **ESP32** – sterowanie zamkiem drzwi

### 📡 Komunikacja
* REST API (HTTP)

---

## API

System korzysta z dwóch API współpracujących ze sobą:

### 🌍 Globalne API (FastAPI)
* Endpointy do zarządzania użytkownikami.  
* Historia logowań i raporty frekwencji.  
* Przypisywanie sal do użytkowników.  
* Obsługa autoryzacji i ról.  
* Obsługa komunikacji z aplikacją mobilną.

### 📌 Lokalne API (Raspberry Pi)
* Przetwarzanie obrazu z kamery i wykrywanie twarzy.  
* Wysyłanie żądań otwierania drzwi do ESP32.  
* Lokalna walidacja tożsamości.  
* Synchronizacja z serwerem globalnym.

---

## Instalacja projektu

### ⚙️ API (Backend)
Jeśli nie masz **Poetry**, zainstaluj go:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

Przejdź do katalogu `api` i zainstaluj zależności:
```bash
cd api
poetry install
poetry add bcrypt  # paczka nie instaluje się razem z innymi
```

Uruchom serwer FastAPI:

**Windows:**
```bash
poetry run python -m app.main
```
**Linux / macOS:**
```bash
poetry run python3 -m app.main
```

API będzie dostępne pod adresem `localhost:8000/eduaccess/v1`.

---

### 💻 Frontend (Admin Panel)
Przejdź do katalogu `admin_panel` i zainstaluj zależności:
```bash
cd admin_panel
npm install --legacy-peer-deps
```
Uruchom aplikację:
```bash
npm run dev
```

---

### 📱 Aplikacja Mobilna
Przejdź do katalogu `mobile` i zainstaluj zależności:
```bash
cd mobile
npm install --legacy-peer-deps
```
Uruchom aplikację:
```bash
npx expo start -c
```

---

### 🗃️ Migracje bazy danych
Tworzenie migracji:
```bash
poetry run alembic revision --autogenerate -m "opis migracji"
```

Aktualizacja migracji:
```bash
poetry run alembic upgrade head
poetry run alembic -x test=true -c alembic_test.ini upgrade head
```

---

## Szczegóły
- [📘 Bardziej szczegółowa wizja systemu (Miro)](https://miro.com/app/board/uXjVIcMhBR4=/?share_link_id=677465281486)

---

## Autorzy
- **Nikodem Młyński** – Full Stack Developer (FastAPI, React, React Native, Raspberry Pi)
- Projekt realizowany w ramach nauki w technikum programistycznym (2025)

---

> 💡 *Projekt wciąż rozwijany — aktualny status i kod źródłowy dostępny w repozytorium. Wersja przygotowana do udziału w hackathonach i prezentacji edukacyjnych.*
