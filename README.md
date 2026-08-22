# 🏠🪑 RentEase-Furniture & Appliance Rentals-MERN Stack Rental Platform

A full-stack rental management web application built with the **MERN** stack (MongoDB, Express.js, React, Node.js).

---

## 📋 Features

- **User Authentication** — Secure JWT-based register & login
- **Property Listings** — Browse, search & filter rental properties
- **Booking System** — Tenants can book properties with date selection
- **Razorpay Payments** — Integrated payment gateway for rent transactions
- **Admin Dashboard** — Manage users, properties, and bookings
- **Email Notifications** — SMTP-based email alerts for bookings & payments
- **Role-Based Access** — Separate flows for Tenants, Landlords, and Admins

---
Home Page 

<img width="1914" height="837" alt="image" src="https://github.com/user-attachments/assets/9e21c545-f35d-4400-9e9e-46beda431965" />

Registration Page

<img width="1920" height="900" alt="image" src="https://github.com/user-attachments/assets/76ec727f-d9b1-4f8b-bc5f-dca9b3ca1334" />

login Page

<img width="1920" height="928" alt="image" src="https://github.com/user-attachments/assets/04e6065f-6df6-43f2-84a4-8f7221a802f0" />

Admin Dashboard Page 

<img width="1920" height="915" alt="image" src="https://github.com/user-attachments/assets/8766424d-71cc-4579-b745-2d962cc66369" />


## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React, Vite, Tailwind CSS           |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB (Atlas)                     |
| Auth       | JWT, bcrypt                         |
| Payments   | Razorpay                            |
| Email      | Nodemailer / SMTP                   |

---

## 📁 Project Structure

```
RentEase-MERN-Stack-Project/
├── Backend/          # Node.js + Express API server
│   ├── controllers/  # Route handler logic
│   ├── middleware/   # Auth & error middleware
│   ├── models/       # Mongoose data models
│   ├── routes/       # API route definitions
│   ├── services/     # Business logic / helper services
│   └── server.js     # App entry point
│
└── Frontend/         # React + Vite client
    ├── public/       # Static assets
    └── src/          # React components, pages, hooks
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Razorpay account (for payments)

### Backend Setup

```bash
cd Backend
cp .env.example .env    # Fill in your credentials
npm install
npm run dev
```

### Frontend Setup

```bash
cd Frontend
cp .env.example .env    # Fill in your VITE_ variables
npm install
npm run dev
```
Admin Login Credentials

Email :- *************************@gmail.com 

Password :- **************

---

## 🔐 Environment Variables

See `Backend/.env.example` and `Frontend/.env.example` for required variables.

---


