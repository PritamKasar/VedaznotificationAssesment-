# 📱 VedazNotification - React Native Push Notification App

A simple yet powerful React Native mobile application that supports **real-time push notifications** (like WhatsApp), built for an internship assignment. It integrates **Firebase Cloud Messaging**, **Kotlin native module**, and a **Node.js backend** to send and receive push notifications, even in background or killed states.

---

## 🚀 Features

- 🔔 Real-time Push Notifications (Foreground, Background, Killed State)
- 🔄 Native Android Notification Handling (Kotlin)
- 🔗 Deep Linking: Tapping notification opens the Notification screen
- 📬 Notification History stored locally using `AsyncStorage`
- 🧹 Delete single or all notifications
- 🔢 Badge count for unread notifications
- 🧪 Backend API simulation (Node.js + Express)
- 🔐 FCM Token Management
- 🎨 Clean and responsive UI

---

## 🧰 Technologies Used

- **React Native**
- **Firebase Cloud Messaging (@react-native-firebase/messaging)**
- **AsyncStorage**
- **React Navigation**
- **Kotlin (Native Android Module)**
- **Node.js + Express (Backend API)**
- **Android 13+ Compatibility**

---

## 🛠️ How to Run

### 1. Clone the Repo

```bash
git clone https://github.com/PritamKasar/VedazNotification.git
cd VedazNotification
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Firebase Setup

- Create a Firebase project
- Download `google-services.json` and place it in `android/app/`
- Download `firebase-admin.json` and place it in `/backend/`

### 4. Start Backend (Node.js)

```bash
cd backend
npm install
node simulation.js
```

### 5. Run Android App

```bash
npx react-native run-android
```

Make sure your Android Emulator or device is running.

---

## 📡 Sending Notification (Backend API)

Send notification using:

**POST** `http://<your-local-ip>:4000/send-notification`

```json
{
  "token": "DEVICE_FCM_TOKEN",
  "title": "Hello",
  "body": "This is a test notification"
}
```

---

## 📦 Folder Structure

```
VedazNotification/
├── android/                      # Android native code (includes Kotlin service)
├── backend/                      # Node.js backend for simulating notification sending
│   ├── simulation.js
│   └── firebase-admin.json
├── App.js / App.jsx              # Main React Native app
├── ...
```

---

## ✅ Completed Functionality (Assignment Checklist)

- [x] React Native App with Push Notification
- [x] FCM Integration
- [x] Native Kotlin module for notification
- [x] Background/Killed state handling
- [x] Deep Linking to open Notification screen
- [x] Notification History using AsyncStorage
- [x] Notification Badge Count
- [x] Delete Single / All Notifications
- [x] Simulated Backend API

---

## 👨‍💻 Developed By

**Pritam Madhukar Kasar**  
• [GitHub](https://github.com/PritamKasar)
