# Odoo Company Expense Tracker

A full-stack expense management system for companies built with **React**, **TypeScript**, and **Node.js/Express** with role-based access control.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Role-based access: Admin, Manager, and Employee
- Add, view, and manage employees
- Admin dashboard with:
  - Total users
  - Pending approvals
  - Approval rules
- Send password emails to new employees
- CRUD operations on employee data
- Responsive UI with **Tailwind CSS**
- Interactive tables and forms

---

## Tech Stack

**Frontend:**

- React + TypeScript
- Tailwind CSS
- React Router
- Sonner for toast notifications
- Lucide Icons

**Backend:**

- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- Role-based authorization
- RESTful API endpoints

---

## Installation

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
Install dependencies:

bash
Copy code
npm install
Create a .env file based on .env.example and add your MongoDB URI and JWT secret.

Start the server:

bash
Copy code
npm run dev
Server will run at http://localhost:3000

Frontend
Navigate to the frontend folder:

bash
Copy code
cd frontend
Install dependencies:

bash
Copy code
npm install
Create a .env file:

env
Copy code
VITE_API_URL=http://localhost:3000/api
Start the frontend:

bash
Copy code
npm run dev
Frontend will run at http://localhost:5173 (or the port shown in terminal)
