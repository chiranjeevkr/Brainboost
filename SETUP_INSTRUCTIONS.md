# BrainBoost Setup Instructions

## Prerequisites
1. Install Node.js (v14 or higher)
2. Install MongoDB Community Edition

## Setup Steps

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Start MongoDB
Open a terminal and run:
```bash
mongod
```

### 4. Start Backend Server
Open a new terminal:
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

### 5. Start Frontend Server
Open another terminal:
```bash
cd frontend
npm start
```
Frontend will run on http://localhost:3000

## Quick Start (Windows)
Double-click `START_SERVERS.bat` to start all servers automatically.

## Testing the Application

1. Go to http://localhost:3000
2. Click "Register" to create a new account
3. Enter:
   - Name: test
   - Email: test@example.com
   - Mode: Adult Mode or Kid Mode
4. Click Register
5. You'll be redirected to the games page

## Login
Use the same credentials you registered with:
- Name: test
- Email: test@example.com
- Mode: (same mode you registered with)

## Troubleshooting

### Backend not connecting?
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify .env file exists in backend folder

### Frontend not loading?
- Make sure backend is running first
- Check browser console for errors
- Verify port 3000 is available

### Login/Register not working?
- Open browser console (F12) to see error messages
- Make sure backend server is running
- Check MongoDB connection