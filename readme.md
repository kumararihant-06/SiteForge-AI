# SiteForge AI 🚀

An AI-powered website builder that generates fully functional websites from plain text prompts. Built with the PERN stack (PostgreSQL, Express, React, Node.js).

![SiteForge AI](https://img.shields.io/badge/SiteForge-AI-4F46E5?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [AI Providers](#ai-providers)
- [Credits System](#credits-system)
- [Payment Integration](#payment-integration)
- [Deployment](#deployment)

---

## Overview

SiteForge AI lets users describe a website in plain English and get a fully functional, styled HTML website in seconds. Users can then chat with AI to make revisions, switch between versions, publish their site, and download the source code.

---

## Features

- **AI Website Generation** — Describe your site and get complete HTML + Tailwind CSS in seconds
- **AI Chat Revisions** — Chat to make changes to your site (e.g. "make the navbar sticky")
- **Version History** — Every generation and revision creates a version snapshot; roll back anytime
- **Live Preview** — See your website rendered in real time inside the builder
- **Device Preview** — Toggle between desktop, tablet, and mobile views
- **Publish & Share** — One-click publish with a public shareable URL
- **Download Source** — Download the generated HTML file
- **Community Gallery** — Browse websites published by other users
- **Credit System** — Pay-as-you-go credits with Razorpay integration
- **Email Verification** — Secure signup with email verification via Mailtrap
- **Multiple AI Providers** — Supports Google Gemini, OpenAI, and Anthropic Claude

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| PostgreSQL + Neon | Cloud database |
| Prisma ORM | Database queries and migrations |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Nodemailer + Mailtrap | Email verification |
| Razorpay | Payment processing |
| Google Gemini API | AI website generation (default) |


### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| Tailwind CSS v4 | Styling |
| React Router DOM v7 | Client-side routing |
| Axios | HTTP requests |
| React Hot Toast | Notifications |

---

## Project Structure

```
SiteForge-AI/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/            # SQL migration files
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── project.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── payment.controller.js
│   │   ├── services/              # Business logic
│   │   │   ├── ai/
│   │   │   │   ├── ai.interface.js    # Base AI provider class
│   │   │   │   ├── ai.factory.js      # Provider factory + model list
│   │   │   │   ├── gemini.service.js  # Google Gemini integration
│   │   │   │   └── prompts.js         # System prompts for AI
│   │   │   ├── auth.service.js
│   │   │   ├── project.service.js
│   │   │   ├── user.service.js
│   │   │   └── payment.service.js
│   │   ├── routes/                # API route definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── project.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── payment.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js  # JWT verification
│   │   │   └── error.middleware.js # Global error handler
│   │   ├── prisma/
│   │   │   └── client.js          # Prisma client instance
│   │   ├── utils/
│   │   │   ├── jwt.js             # Token generation/verification
│   │   │   ├── hash.js            # Password hashing helpers
│   │   │   └── email.js           # Email sending helpers
│   │   └── app.js                 # Express app setup
│   ├── server.js                  # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── index.js           # All API call functions
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state
    │   ├── components/
    │   │   └── ProtectedRoute.jsx # Route guard component
    │   ├── pages/
    │   │   ├── Home.jsx           # Landing page
    │   │   ├── Login.jsx          # Login page
    │   │   ├── Signup.jsx         # Signup page
    │   │   ├── Projects.jsx       # Projects dashboard
    │   │   ├── Builder.jsx        # AI builder workspace
    │   │   ├── Community.jsx      # Public gallery
    │   │   ├── Pricing.jsx        # Plans and payments
    │   │   ├── Settings.jsx       # User settings
    │   │   └── Preview.jsx        # Public project preview
    │   ├── App.jsx                # Routes configuration
    │   └── main.jsx               # App entry point
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- A PostgreSQL database (Neon recommended — free tier available at neon.tech)
- A Mailtrap account for email (free at mailtrap.io)
- A Google Gemini API key (free at aistudio.google.com)
- A Razorpay account for payments (razorpay.com)

---

### Backend Setup

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/siteforge-ai.git
cd siteforge-ai/backend
```

**2. Install dependencies**

```bash
npm install
```

**3. Create `.env` file** (see [Environment Variables](#environment-variables) section)

```bash
cp .env.example .env
# Fill in your values
```

**4. Run database migrations**

```bash
npx prisma migrate dev
```

**5. Start the development server**

```bash
npm run server
```

The backend will start on `http://localhost:3000`

---

### Frontend Setup

**1. Navigate to frontend directory**

```bash
cd ../frontend
```

**2. Install dependencies**

```bash
npm install
```

**3. Create `.env` file**

```bash
VITE_API_URL=http://localhost:3000/api
```

**4. Start the development server**

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## Environment Variables

### Backend `.env`

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Server
PORT=3000
NODE_ENV=development
TRUSTED_ORIGINS=http://localhost:5173

# Auth
JWT_SECRET="your-super-secret-jwt-key"

# Email (Mailtrap)
MAILTRAP_USER="your-mailtrap-user"
MAILTRAP_PASS="your-mailtrap-password"

# AI Providers
GEMINI_API_KEY="AIza..."

# Razorpay
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Client
CLIENT_URL="http://localhost:5173"
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:3000/api
```

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login with email + password | No |
| GET | `/verify-email` | Verify email with token | No |
| POST | `/logout` | Logout and blacklist token | Yes |

### Project Routes — `/api/projects`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/published` | Get all published projects | No |
| GET | `/published/:id` | Get single published project | No |
| POST | `/create` | Create new AI-generated project | Yes |
| GET | `/all-projects` | Get all user projects | Yes |
| GET | `/all-projects/:id` | Get single project with versions + conversation | Yes |
| DELETE | `/all-projects/:id` | Delete a project | Yes |
| PUT | `/save/:id` | Save current code + create version | Yes |
| PUT | `/publish/:id` | Toggle publish/unpublish | Yes |
| POST | `/revision/:id` | Make AI revision to existing site | Yes |
| GET | `/rollback/:projectId/:versionId` | Rollback to a previous version | Yes |

### User Routes — `/api/users`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/profile` | Get current user profile | Yes |
| GET | `/credits` | Get current credit balance | Yes |
| PUT | `/update-name` | Update display name | Yes |
| PUT | `/update-password` | Change password | Yes |
| DELETE | `/delete-account` | Permanently delete account | Yes |

### Payment Routes — `/api/payments`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/create-order` | Create Razorpay order | Yes |
| POST | `/verify` | Verify payment and add credits | Yes |

---

## Database Schema

```
User
  ├── id, email, name, password
  ├── credits (default: 20)
  ├── totalCreation
  ├── emailVerified
  └── relations: projects, accounts, transactions

WebsiteProject
  ├── id, name, initial_prompt
  ├── current_code (full HTML)
  ├── isPublished
  ├── aiModel (which provider was used)
  └── relations: conversation, versions, user

Conversation
  ├── role (user | assistant)
  ├── content
  └── projectId

Version
  ├── code (full HTML snapshot)
  ├── description
  ├── aiModel
  └── projectId

Transaction
  ├── planId, amount, credits
  ├── isPaid
  └── userId

Verification
  ├── identifier (email)
  ├── value (token)
  └── expiresAt
```

---

## AI Providers

The AI layer uses a **factory pattern** which makes it easy to swap providers.

### How it works

```
User submits prompt
       ↓
Step 1 — Enhance the prompt (AI expands it with design details)
       ↓
Step 2 — Generate the full HTML website from the enhanced prompt
       ↓
Save to database + create version snapshot
```

### Adding a new provider

1. Create `src/services/ai/yourprovider.service.js`
2. Extend the `AIProvider` base class from `ai.interface.js`
3. Implement the `generate(messages)` method
4. Register it in `ai.factory.js`

### Default provider

Google Gemini (`gemini-1.5-flash-latest`) is the default provider. It has a generous free tier and produces high quality results.

---

## Credits System

| Action | Cost |
|---|---|
| New account signup | +20 free credits |
| Generate website | -5 credits |
| AI revision | -1 credit |

### Credit Plans (Razorpay)

| Plan | Price | Credits |
|---|---|---|
| Basic | ₹499 | 100 credits |
| Pro | ₹1899 | 400 credits |
| Enterprise | ₹4999 | 1000 credits |

---

## Payment Integration

Payments use **Razorpay** in test mode by default.

### Flow

```
User clicks "Buy Plan"
       ↓
Frontend calls POST /api/payments/create-order
       ↓
Backend creates Razorpay order, returns orderId + keyId
       ↓
Frontend opens Razorpay popup
       ↓
User completes payment
       ↓
Razorpay calls handler with payment signature
       ↓
Frontend calls POST /api/payments/verify
       ↓
Backend verifies HMAC signature
       ↓
Credits added to user account
```

### Test Cards (Razorpay test mode)

| Card Number | Expiry | CVV |
|---|---|---|
| 4111 1111 1111 1111 | Any future date | Any 3 digits |

---

## Deployment

### Backend — Railway

1. Push backend to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add all environment variables in the Variables tab
4. Railway auto-detects Node.js and runs `npm start`

### Frontend — Vercel

1. Push frontend to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variable: `VITE_API_URL=https://your-railway-app.up.railway.app/api`
4. Deploy

### After deployment

Update `TRUSTED_ORIGINS` in your Railway backend environment variables:

```env
TRUSTED_ORIGINS=https://your-app.vercel.app
```

---

## License

MIT License — feel free to use this project for learning and portfolio purposes.