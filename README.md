# Booking Application Frontend

React + TypeScript frontend for the **Ad Space Booking System**.
Provides UI for managing **Ad Spaces** and **Booking Requests**, and communicates with the Spring Boot backend via REST APIs.

<img width="1920" height="980" alt="2" src="https://github.com/user-attachments/assets/68de1eba-9426-4ed1-b2f9-6ef74b771f50" />


<img width="1920" height="986" alt="3" src="https://github.com/user-attachments/assets/acf06a1d-8123-48e6-a02d-fec01194a860" />


---

## Tech Stack

- React
- TypeScript
- Node.js / npm
- Project API client: `src/api`
- State management: `src/store` (project-specific)

---

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+

---

## Setup

Install dependencies:

```bash
npm install
```

---

## Configuration

The frontend expects the backend base URL via an environment variable.

I've added a proxy "proxy": "http://localhost:8080" in the package.json so it should work by default locally.

If using env. Example `.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

---

## Run locally

Start the dev server:

```bash
npm start
```

Open:

- `http://localhost:3000`

---

## Build

Create a production build:

```bash
npm run build
```

---

## Tests

Run unit tests:

```bash
npm test
```

---

## Project Structure (high level)

Common folders you’ll find in this project:

```
src/
  api/            # HTTP client + backend API modules
  components/     # reusable UI components
  features/       # feature modules (e.g., ad spaces / bookings)
  store/          # state management
  types/          # domain types (DTO-like interfaces)
```

---

## Backend dependency

This UI requires the backend to be running (default):

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`

If the backend runs on another port/host, update `REACT_APP_API_BASE_URL`.

---

## Notes for reviewers

- The UI uses a dedicated API layer and typed DTO-like models (`src/types`)
- Key flows: ad space CRUD, booking request create + approve/reject
- Error states from the backend are surfaced in the UI where applicable

---

## License

Provided for interview evaluation purposes.
