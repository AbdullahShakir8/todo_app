# Full-Stack Todo App — React + Express + MySQL

A clean, professional todo app built to teach full-stack development.
Every file is commented to explain the **why**, not just the **what**.

---

## What you'll learn

| Concept | Where to find it |
|---|---|
| REST API design | `backend/src/routes/` |
| MVC pattern | `backend/src/models/` + `controllers/` |
| JWT authentication | `backend/src/middleware/auth.js` |
| Password hashing | `backend/src/models/User.js` |
| MySQL connection pool | `backend/src/config/db.js` |
| Input validation | `backend/src/middleware/validate.js` |
| React Context (global state) | `frontend/src/context/AuthContext.js` |
| Custom hooks | `frontend/src/hooks/useTodos.js` |
| Axios interceptors | `frontend/src/services/api.js` |
| Protected routes | `frontend/src/components/layout/ProtectedRoute.js` |
| Component composition | `frontend/src/components/todos/` |

---

## Project structure

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js          ← MySQL pool + test connection
│   │   │   └── schema.sql     ← Run once to create tables
│   │   ├── models/
│   │   │   ├── User.js        ← All user SQL queries
│   │   │   └── Todo.js        ← All todo SQL queries
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── todoController.js
│   │   ├── middleware/
│   │   │   ├── auth.js        ← JWT protect middleware
│   │   │   └── validate.js    ← express-validator rules
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── todoRoutes.js
│   │   └── server.js          ← Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── services/
    │   │   └── api.js         ← All axios calls + interceptors
    │   ├── context/
    │   │   └── AuthContext.js ← Global auth state
    │   ├── hooks/
    │   │   └── useTodos.js    ← All todo state logic
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.js
    │   │   │   └── ProtectedRoute.js
    │   │   ├── todos/
    │   │   │   ├── StatsBar.js
    │   │   │   ├── TodoFilters.js
    │   │   │   ├── TodoForm.js
    │   │   │   ├── TodoItem.js
    │   │   │   └── TodoList.js
    │   │   └── ui/
    │   │       └── Alert.js
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   └── TodoPage.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## Setup & run

### 1. Database

```bash
# Log into MySQL and run the schema
mysql -u root -p < backend/src/config/schema.sql
```

### 2. Backend

```bash
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Edit .env — fill in DB_PASSWORD and change JWT_SECRET

# Start dev server (auto-restarts on save)
npm run dev
```

Server runs on **http://localhost:5000**

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start React dev server
npm start
```

App opens on **http://localhost:3000**

---

## API reference

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/auth/me` | Yes | Get current user |

### Todos
| Method | Path | Description |
|---|---|---|
| GET | `/api/todos` | Get all (supports `?status=active&priority=high&search=text`) |
| GET | `/api/todos/stats` | Get counts |
| POST | `/api/todos` | Create |
| PUT | `/api/todos/:id` | Update |
| PATCH | `/api/todos/:id/toggle` | Toggle completed |
| DELETE | `/api/todos/:id` | Delete |

All todo routes require `Authorization: Bearer <token>` header.

---

## Key patterns explained

### Why MVC?
Models handle data, Controllers handle logic, Routes handle HTTP.
Each file has one job — easy to find, easy to test, easy to change.

### Why a custom hook (`useTodos`)?
All todo state lives in `useTodos.js`. The `TodoPage` component just
connects the hook to the UI. If you need todos on another page, you
just call `useTodos()` there too.

### Why axios interceptors?
The request interceptor automatically adds the JWT to every request.
The response interceptor automatically redirects to `/login` on any 401.
You write this logic once — not in every API call.

### Why a connection pool?
Opening a new database connection per request is slow and wasteful.
A pool keeps connections open and reuses them, handling concurrency cleanly.
