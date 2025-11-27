React presentation layer for `zad3` web shop.

## Features

- React Router for multi-page navigation (Products, Orders, Login)
- JWT authentication with token management
- Reusable components (ProductCard, Navigation, ProtectedRoute)
- Bootstrap styling
- API integration with SvelteKit backend

## Setup

### 1. Install dependencies

```powershell
cd react-app
npm install
```

This will install:
- React 18
- React Router v6 for page routing
- Bootstrap 5 and React Bootstrap for UI
- Vite for development and building

### 2. Start dev server

Keep the SvelteKit backend running (in `zad3/` root):

```powershell
npm run dev
```

Then start React dev server (in `react-app/`):

```powershell
npm run dev
```

React runs on port **3000**, SvelteKit on port **5173**.
Vite proxy automatically forwards `/api/*` calls to the backend.

### 3. Open app

Visit: `http://localhost:3000`

The proxy configuration in `vite.config.js` forwards `/api` requests to `http://localhost:5173`.

## Project Structure

```
src/
├── App.jsx                    # Main router setup
├── main.jsx                   # React entry point
├── pages/
│   ├── LoginPage.jsx          # Login form
│   ├── ProductsPage.jsx       # List of products
│   └── OrdersPage.jsx         # List of user orders
├── components/
│   ├── Navigation.jsx         # Top navbar
│   ├── ProductCard.jsx        # Reusable product card
│   └── ProtectedRoute.jsx     # Route guard for authenticated pages
├── hooks/
│   └── useAuth.js             # Auth logic (login/logout)
└── utils/
    ├── api.js                 # API client with JWT handling
    └── storage.js             # Token storage helpers
```

## Authentication Flow

1. User logs in via `LoginPage` → POST `/api/login`
2. Backend returns `accessToken` (1h) and `refreshToken` (7d)
3. Tokens stored in `localStorage`
4. `useAuth` hook manages login state
5. API calls include token in `Authorization: Bearer <token>` header
6. Protected pages wrapped with `<ProtectedRoute>`

## Build for production

```powershell
npm run build
```

Output goes to `dist/` folder. You can copy this to SvelteKit `static/` for single-origin deployment.

## Environment

The Vite dev proxy is configured in `vite.config.js`:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': 'http://localhost:5173'
  }
}
```

Adjust the proxy target if SvelteKit runs on a different port.

