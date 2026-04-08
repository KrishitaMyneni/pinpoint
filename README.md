# Context-Aware Location and Place Discovery Platform

A full-stack web application for discovering places based on user location, categories, and ratings.

## 🚀 Key Features
- **Geolocation**: Get current location using browser API.
- **Interactive Map**: Visualize places with Leaflet integration.
- **Search & Filters**: Search by name and filter by rating, distance, category, and status.
- **Responsive UI**: Modern, clean design using Vanilla CSS.

## 🛠️ Stack
- **Frontend**: React.js, Vite, Axios, Leaflet.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).

## 📂 Project Structure
- `frontend/`: React application using Vite.
- `backend/`: Express server with Mongoose models.

## 🔧 Installation & Running

### 1. Prerequisites
- Node.js installed.
- MongoDB installed and running locally.

### 2. Backend Setup
```bash
cd backend
npm install
node server.js
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

### 4. Seed Data
To populate the database with sample places, click the "Browse All" button on the home page or call `POST /api/places/seed` from the backend. (included a seed route in `server.js`).

