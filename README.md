# Mini CRM Application

A full-stack Customer Relationship Management (CRM) application built using React, Node.js, Express, and MongoDB.

This application allows users to manage leads, track their status, and maintain follow-up notes through a clean dashboard interface.

## Features

- 🔐 Login Authentication (admin/admin)
- ➕ Add New Leads
- 🗑 Delete Leads
- 🔄 Update Lead Status (New, Contacted, Converted)
- 📝 Add Follow-Up Notes
- 🔍 Search Leads by Name or Email
- 🎯 Filter Leads by Status
- ↕ Sort Leads (Newest / Oldest)
- 📊 Dashboard Statistics (Total, New, Contacted, Converted)
- 🎨 Modern UI with animations

---

##  Tech Stack

### Frontend
- React (Vite)
- CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

---

---

##  Project Structure
mini-crm/
│
├── backend/ # Express + MongoDB API
└── frontend/ # React (Vite) application

---

##  Setup Instructions

### 1. Clone the Repository


git clone https://github.com/your-username/FUTURE_FS_02.git

cd FUTURE_FS_02


---

### 2. Backend Setup


cd backend
npm install

Create a `.env` file inside the `backend` folder and add:

MONGO_URI=mongodb+srv://nehasolai:MongoDb4@cluster0.shzjtfn.mongodb.net/miniCRM?appName=Cluster0

Start the backend server:

npm start

The backend will run on:

http://localhost:5000


---

### 3. Frontend Setup

Open a new terminal:


cd frontend
npm install
npm run dev


The frontend will run on:


http://localhost:5173


---

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /api/leads | Get all leads |
| POST | /api/leads | Create a new lead |
| PATCH | /api/leads/:id | Update lead status |
| PATCH | /api/leads/:id/followup | Add follow-up note |
| DELETE | /api/leads/:id | Delete lead |

---

##  Author

Neha Solai

---

##  License

This project is created for educational purposes.
