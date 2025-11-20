MERN Starter Template
=====================

This project is a boilerplate starter for building full-stack MERN applications with **TypeScript** support and **JWT-based authentication**.

Project Structure
-----------------

mern-starter\
├── react/      # React + Vite frontend with authentication support\
├── express/        # Express + MongoDB backend with authentication APIs\
├── README.md      # This file
    

Features
--------

*   React + Vite frontend
*   Express + MongoDB backend
*   JWT authentication (Access + Refresh tokens)
*   User registration & login
*   Protected routes
*   TypeScript support

Getting Started
---------------

These instructions will help you run the project locally.

### Prerequisites

*   Node.js (v14 or higher recommended)
*   npm (comes with Node.js)
*   MongoDB instance URI (optional; if not provided, an in-memory server will be used)

Installation
------------

Open two terminal windows or use your favorite terminal multiplexer.

### Backend

cd server \
npm install
    

### Frontend

cd client \
npm install
    

Configuration: MongoDB & Authentication
---------------------------------------

The backend uses a MongoDB URI to connect to a real database.

1.  Create a `.env` file inside the `express/` folder.
2.  Add the following inside `.env`:

MONGO\_URI=your-mongodb-connection-string
PORT=5000
ACCESS\_TOKEN\_SECRET=your\_access\_secret\_here
REFRESH\_TOKEN\_SECRET=your\_refresh\_secret\_here
ACCESS\_TOKEN\_EXPIRY=15m
REFRESH\_TOKEN\_EXPIRY=7d
    

If you do not provide a `MONGO_URI`, the backend will fallback to using an **in-memory MongoDB server** for rapid prototyping purposes.

Running the Project
-------------------

Open two terminal windows/tabs:

### Start the backend server:

cd server\
npm run dev
    

### Start the frontend server:

cd client\
npm run dev
    

**Frontend:** [http://localhost:5173](http://localhost:5173)

**Backend:** [http://localhost:5000](http://localhost:5000)

Authentication Usage
--------------------

### Backend

The backend exposes the following routes:

Route

Method

Description

/api/auth/register

POST

Register a new user

/api/auth/login

POST

Login and get access & refresh tokens

/api/auth/refresh

POST

Get a new access token using refresh token

/api/auth/logout

POST

Logout and invalidate refresh token

Protected routes require a valid **access token** in the `Authorization` header:

Authorization: Bearer <access\_token>
    

### Frontend

The frontend includes:

*   Registration and login forms
*   Authentication context to manage tokens and user state
*   Protected routes using React Router
*   Automatic token refresh when access token expires
