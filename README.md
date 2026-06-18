# Birthday Board

## Overview

Birthday Board is a full-stack birthday management app built for a job assignment.

The app allows authenticated users to view a shared birthday board, see whose birthday is today, and add, edit, or delete birthday records.

## Tech Stack

* Frontend: React + TypeScript
* Backend: Node.js + Express + TypeScript
* Database: Prisma with a cloud-hosted SQL database on Railway
* Authentication: JWT

## Project Structure

```bash
Birthday Board/
├── client/   # React frontend
└── server/   # Express backend + Prisma
```

## Prerequisites

Before running the project, make sure you have:

* Node.js 20+
* npm
* Git

## Environment Variables

Normally, environment files and database credentials should not be committed to source control.

For the purpose of this home assignment only, the environment values are provided below so the reviewers can run the project easily with the provided Railway database.

Create a `.env` file inside the `/server` folder and add:

```env
DATABASE_URL="mysql://root:kgqgYmKZdxaRJviNhosunmldrcELGNom@turntable.proxy.rlwy.net:58696/railway"
JWT_SECRET="super-secret-dev-key-change-later"
PORT=4000
CLIENT_URL="http://localhost:5173"
JWT_EXPIRES_IN="7d"
```

These credentials are provided only for evaluation purposes.

## Installation

Clone the repository:

```bash
git clone <repo-url> "Birthday Board"
cd "Birthday Board"
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

## Database Setup

The project uses a Railway cloud database through the `DATABASE_URL` provided above.

From the `/server` folder, run:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

The seed script creates:

* one demo user
* several birthday records
* at least one birthday record for today

This allows the app to run from a clean clone with demo data.

## Running the App

Start the backend from the `/server` folder:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:4000
```

Start the frontend in a second terminal from the `/client` folder:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Demo Login

After running the seed script, use the following demo account:

```text
Email: demo@birthdayboard.local
Password: DemoPass123!
```

## Main Features

* Login and registration
* Shared birthday board after authentication
* Today's birthdays section
* Paginated birthday list
* Add, edit, and delete birthday records
* Backend validation
* Centralized backend error handling
* JWT-based authentication
* Seeded demo data

## Design Notes

The birthday board is shared/global by design.

Any authenticated user can view and manage the shared birthday list. This was an intentional design choice for this assignment.

## API Endpoints

### Auth

```http
POST /api/auth/register
POST /api/auth/login
```

### Birthdays

All birthday routes require a JWT token:

```http
Authorization: Bearer <token>
```

```http
GET    /api/birthdays/today
GET    /api/birthdays?page=<page>&limit=<limit>
POST   /api/birthdays
PUT    /api/birthdays/:id
DELETE /api/birthdays/:id
```

## Troubleshooting

### Server fails to start

Make sure the `.env` file exists inside the `/server` folder and contains the values listed above.

Then run:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

### Client cannot connect to backend

Make sure the backend is running on:

```text
http://localhost:4000
```

Also make sure `CLIENT_URL` in `/server/.env` is set to:

```text
http://localhost:5173
```

### Seed fails

Make sure:

* the Railway database is reachable
* the `DATABASE_URL` was copied correctly into `/server/.env`
* migrations were run before seeding

Then run again from `/server`:

```bash
npm run seed
```

### Login fails

Make sure the seed script was executed successfully.

Then log in with:

```text
Email: demo@birthdayboard.local
Password: DemoPass123!
```
