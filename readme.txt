========================================
 TEAM TASK MANAGER
========================================

Description
-----------
Team Task Manager is a full-stack SaaS application built to manage projects and tasks collaboratively. It features a modern, dynamic Kanban board, role-based access control (Admin vs Member), and responsive layouts.

Live Links
----------
* Frontend (Vercel): https://team-task-manager-pi-three.vercel.app/
* Backend API (Railway): https://team-task-manager-production-d00e.up.railway.app/

Tech Stack
----------
* Frontend: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Zustand
* Backend: Node.js, Express, MongoDB
* Deployment: Ready for Vercel (Frontend) and Railway (Backend)

Directory Structure
-------------------
* /frontend - Contains the React Vite frontend application
* /backend  - Contains the Node/Express backend API

How to Run Locally
------------------
1. Database Setup:
   Make sure you have MongoDB installed or have an external MongoDB connection string (URI).

2. Backend Setup:
   - Navigate to the `/backend` folder.
   - Install dependencies: `npm install`
   - Create a `.env` file with your environment variables (MONGO_URI, JWT_SECRET, PORT).
   - Start the development server: `npm run dev`

3. Frontend Setup:
   - Navigate to the `/frontend` folder.
   - Install dependencies: `npm install`
   - Create a `.env` file with `VITE_API_URL=http://localhost:5000/api`
   - Start the development server: `npm run dev`

4. Access the Application:
   Open your browser and navigate to `http://localhost:5173`. 
   
Role Definitions
----------------
* Admin: Can create projects, set the member count, assign members, and create tasks.
* Member: Can view projects, manage tasks via the Kanban board (drag and drop), and view the list of team members assigned to their project.

Deployment
----------
* The backend is configured for deployment on Railway (ensure root directory is set to `/backend`).
* The frontend is configured for Vercel. A `vercel.json` is provided to handle single-page application routing. Set the `VITE_API_URL` environment variable to your deployed backend API URL.
