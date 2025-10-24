# 🏫 Intelligent Access Control System for Schools

## 📋 Table of Contents
1. [Project Description](#project-description)
2. [Project Status](#project-status)
3. [Key Features](#key-features)
4. [Runtime Environment](#runtime-environment)
5. [API Architecture](#api)
6. [Project Installation](#project-installation)
7. [Details and Documentation](#details)
8. [Authors](#authors)

---

## Project Description

**Intelligent Access Control System for Schools** is an application designed to automate classroom access management using **facial recognition** technology and a **mobile app**.  
The system replaces traditional RFID cards and integrates with the school schedule, ensuring dynamic, secure, and flexible access management for students and teachers.

---

## Project Status

| Feature | Status |
|----------|--------|
| Face authorization | 🔜 In configuration with ESP32 |
| Intelligent access management | ✅ Ready |
| Door control via ESP32 | ⚙️ In testing |
| Admin panel (React + FastAPI) | ✅ Ready |
| Mobile app (React Native + Expo) | ✅ Ready |
| Monitoring and reports | ✅ Ready |

---

## Key Features

### 🔐 Face Authorization
* Raspberry Pi with a camera analyzes the image using **OpenCV + TensorFlow**.  
* After recognizing a face, the system verifies the user's permissions in the **PostgreSQL** database.

### 🧠 Intelligent Access Management
* **Teachers** have access to the rooms where they conduct classes.  
* **Students** can enter only the rooms where they have lessons.  
* **Administrator** can manually modify user access rights.

### 🚪 Door Control via ESP32
* After successful authorization, Raspberry Pi sends an **HTTP request** to the **ESP32**, which controls the servo motor that opens the door.

### 📱 Mobile App (for Students and Teachers)
* **Students** can:
  * send **room access requests** directly from the app,  
  * view **attendance statistics**,  
  * check **their class schedule**.  
* **Teachers** can:
  * **approve** room access requests sent by students,  
  * **manage** room access through the mobile app,  
  * **modify** attendance for their students.

### 🧰 Admin Panel (React + FastAPI)
* Manage users and their access rights.  
* View **entry and exit logs**.  
* Assign **Raspberry Pi** devices to specific rooms and monitor their status.

### 📊 Monitoring and Reports
* Room access history.  
* Attendance reports for students and teachers.  
* Notifications about unauthorized access attempts.

---

## Runtime Environment

### 🖥 Frontend (Admin Panel)
* React + TypeScript  
* Zustand (state management)  
* @tanstack/react-query (API queries)  
* shadcn/ui + lucide-react (UI)

### 🌐 Backend (API + AI)
* FastAPI (Python) – handles API requests  
* PostgreSQL – database  
* OpenCV + TensorFlow – facial recognition

### 📱 Mobile App
* React Native + Expo  
* Zustand (state management)  
* axios – API communication  
* Compatible with Android and iOS

### 🔧 Microcontrollers and Hardware
* **Raspberry Pi 5 + Pi Camera Module 3** – facial recognition and authorization  
* **ESP32** – door lock control

### 📡 Communication
* REST API (HTTP)

---

## API

The system uses two cooperating APIs:

### 🌍 Global API (FastAPI)
* Endpoints for user management.  
* Login history and attendance reports.  
* Room assignments for users.  
* Authorization and role handling.  
* Communication with the mobile app.

### 📌 Local API (Raspberry Pi)
* Processes camera images and detects faces.  
* Sends door-opening requests to ESP32.  
* Local identity validation.  
* Synchronizes with the global server.

---

## Project Installation

### ⚙️ API (Backend)
If you don’t have **Poetry**, install it:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

Go to the `api` directory and install dependencies:
```bash
cd api
poetry install
poetry add bcrypt  # this package doesn’t install automatically with others
```

Run the FastAPI server:

**Windows:**
```bash
poetry run python -m app.main
```
**Linux / macOS:**
```bash
poetry run python3 -m app.main
```

The API will be available at `localhost:8000/eduaccess/v1`.

---

### 💻 Frontend (Admin Panel)
Go to the `admin_panel` directory and install dependencies:
```bash
cd admin_panel
npm install --legacy-peer-deps
```
Run the app:
```bash
npm run dev
```

---

### 📱 Mobile App
Go to the `mobile` directory and install dependencies:
```bash
cd mobile
npm install --legacy-peer-deps
```
Run the app:
```bash
npx expo start -c
```

---

### 🗃️ Database Migrations
Create a migration:
```bash
poetry run alembic revision --autogenerate -m "migration description"
```

Apply migrations:
```bash
poetry run alembic upgrade head
poetry run alembic -x test=true -c alembic_test.ini upgrade head
```

---

## Details
- [📘 More detailed system vision (Miro)](https://miro.com/app/board/uXjVIcMhBR4=/?share_link_id=677465281486)

---

## Authors
- **Nikodem Młyński** – Full Stack Developer (FastAPI, React, React Native, Raspberry Pi)
- Project developed as part of a programming technical school course (2025)

---

> 💡 *Project under active development — current status and source code available in the repository. Version prepared for hackathons and educational presentations.*
