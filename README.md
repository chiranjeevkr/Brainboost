# BrainBoost - Memory Game Web Application

A MERN stack web application designed to help people and children boost their memory through fun gaming activities.

## Features

- **Landing Page**: Welcome message with signup/login options
- **User Registration**: Separate signup for General users and Parents
- **Authentication**: Login system for General, Parent, and Kids accounts
- **User Profiles**: Editable profile with name, gender, age, email, phone number
- **Password Management**: Change password functionality
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs for hashing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/brainboost
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

## Usage

1. Visit `http://localhost:3000` to access the landing page
2. Sign up as either General user or Parent
3. Login with your credentials
4. Access your profile to edit personal information
5. Change password when needed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

## Database Schema

### User Model
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- age (Number, required)
- gender (String, optional)
- phoneNumber (String, optional)
- userType (String: 'general' or 'parent')

### Child Model
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- age (Number, required)
- gender (String, optional)
- parent (ObjectId, reference to User)

## Future Enhancements
- Memory games implementation
- Parent-child account linking
- Game progress tracking
- Leaderboards and achievements