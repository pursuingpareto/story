# Story Collaboration Backend

A real-time collaborative story creation platform built with Node.js, Express, Socket.IO, and MongoDB.

## Features

- **Real-time Collaboration**: Multiple users can edit stories simultaneously
- **User Authentication**: JWT-based authentication with user registration/login
- **Story Management**: Create, read, update, and delete stories
- **Collaboration System**: Add collaborators with different permission levels
- **Live Presence**: See who's currently editing a story
- **Version Control**: Track story versions and changes
- **User Profiles**: Manage user profiles and search for other users

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing, helmet for security headers
- **Validation**: express-validator

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/story-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Stories
- `GET /api/stories` - Get user's stories (owned and collaborated)
- `POST /api/stories` - Create new story
- `GET /api/stories/:storyId` - Get specific story
- `PATCH /api/stories/:storyId/content` - Update story content
- `DELETE /api/stories/:storyId` - Delete story

### Users
- `GET /api/users/profile` - Get current user profile
- `PATCH /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users
- `GET /api/users/online` - Get online users

## Socket.IO Events

### Client to Server
- `join-story` - Join a story room
- `leave-story` - Leave a story room
- `story-update` - Update story content
- `cursor-update` - Update cursor position
- `typing-start` - Start typing indicator
- `typing-stop` - Stop typing indicator
- `user-presence` - Update user presence

### Server to Client
- `story-updated` - Story content updated by another user
- `user-joined-story` - User joined the story
- `user-left-story` - User left the story
- `story-users` - List of active users in story
- `user-cursor-update` - Another user's cursor position
- `user-typing` - User typing indicator
- `user-presence-update` - User presence update
- `error` - Error message

## Database Models

### User
- Basic profile (username, email, password)
- Online status and last seen
- Stories owned and collaborations
- Avatar and bio

### Story
- Title, description, and metadata
- Owner and collaborators with roles
- Story content as a Map of nodes
- Version tracking and edit history
- Active users tracking

## Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured for frontend origin
- **Rate Limiting**: Prevents abuse
- **Input Validation**: express-validator for request validation
- **Security Headers**: Helmet for additional security

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRES_IN` - JWT expiration time
- `CORS_ORIGIN` - Allowed CORS origin

## Production Deployment

1. **Set environment variables for production**
2. **Use a process manager like PM2**
3. **Set up MongoDB Atlas or production MongoDB**
4. **Configure reverse proxy (nginx)**
5. **Set up SSL certificates**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

