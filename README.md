# Campus Lost and Found Management System

A web application designed to centralize lost and found items across multiple campuses, making it easier for students and faculty to report and claim items

## Team Members - Group 9
- Ishanshika Arora
- Sameera Shah
- Shania Kohli
- Noelle Hom

## Overview
This project provides a centralized platform for managing lost and found items on multiple campuses. Users can:
- Report lost items with detailed descriptions
- Post found items with a location and description
- Make claims on items
- Track claim status through resolution

## Technology Stack
**Frontend**
- React.js with TypeScript
- Axios for API communication
- React Router for navigation
**Backend**
- Flask (Python)
- Flask-CORS for cross-origin requests
- PostgreSQL database with psycopg2
**Database**
- PostgreSQL with custom ENUM types
- Five main entities: Users, Items, Campus, Claims, Item_Images

## Prerequisites
- Node.js (v18+)
- Python (3.8+)
- PostgreSQL (14+)

## Quick Start
### 1. Clone the Repository
```bash
git clone https://github.com/nmhom/CSE412-Lost-and-Found.git
cd CSE412-Lost-and-Found
```
### 2. Database Setup
1. Create a PostgreSQL database named `lost_found_db`
2. Run the schema creation script in pgAdmin
3. Import data from the provided `.tbl` files using COPY commands from the Phase 03 Document

### 3. Backend Setup
```bash
cd backend
pip install flask flask-cors psycopg2-binary
```

Update `config.py` with your PostgreSQL credentials:
```python
DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/lost_found_db"
```
Start the backend server:
```bash
python app.py
```
Backend runs on `http://localhost:8000`

### 4. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

## Features

### User Management
- Secure registration and login
- Profile management
- View personal claims history

### Item Management
- Create, edit, and delete lost/found items
- Upload item descriptions and locations
- Categorize items by campus location
- Mark items as lost, found, or resolved

### Claims System
- Submit claims for items
- Update claim status
- Delete claims
- Track all personal claims in profile

