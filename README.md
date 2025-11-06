# BrainBoost - Brain Training Web Application

A MERN stack web application for brain training with separate modes for kids and adults.

## Features

### Authentication
- Passwordless authentication (name, email, mode selection)
- Separate kid and adult modes
- User progress tracking

### Kid Mode Games
- 🐾 **Animal Memory Game** - Remember and repeat animal sequences (10 levels)
- 🌈 **Rainbow Memory Game** - Match color sequences (10 levels)
- ⭐ **Counting Stars** - Count stars quickly (10 levels)

### Adult Mode Games
- 💡 **Pattern Creator** - Memorize and recreate patterns (10 levels)

### Additional Features
- Progress saving and resume functionality
- Level progression system
- IQ test
- Puzzle generator
- Progress tracking dashboard

## Tech Stack

### Frontend
- React with TypeScript
- React Router
- Axios
- CSS3 with animations

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Usage

1. Register with name, email, and select mode (kid/adult)
2. Login with the same credentials
3. Play games and track your progress
4. Resume from where you left off

## Game Features

- **Level Progression**: Complete current level to unlock next
- **Progress Saving**: All progress saved to database
- **Continue/Start Over**: Resume from saved level or start fresh
- **Timed Challenges**: Memory and counting games with countdown timers
- **Visual Feedback**: Animations and success messages

## License

MIT
