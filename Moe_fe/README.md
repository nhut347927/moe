# Moe Frontend Application

## Project Overview
Moe is a modern web application built with React, TypeScript, and Vite. It features a client-facing social media-like platform where users can view, like, and comment on media posts. The application also includes an admin panel for managing users and songs, as well as a full authentication system supporting email/password and Google OAuth login.

## Technology Stack
- **React 18** with TypeScript for building the user interface
- **Vite** as the build tool and development server
- **React Router v6** for client-side routing
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **React Activation** for component caching (KeepAlive)
- **Axios** for API requests
- **Lucide React** for icons
- **Google OAuth** for social login
- **Various custom hooks and context providers** for app-specific logic

## Project Structure

```
src/
├── App.tsx                  # Main app component with routing and theming
├── main.tsx                 # App entry point, renders App with providers
├── assets/                  # Static assets like images and styles
├── common/                  # Common utilities, hooks, context providers
├── components/              # Reusable UI components and dialogs
├── pages/                   # Page components grouped by feature and role
│   ├── client/              # Client-facing pages (home, profile, search, upload)
│   ├── admin/               # Admin panel pages (dashboard, manage users, songs)
│   ├── auth/                # Authentication pages (login, register, password reset)
├── routers/                 # Route definitions and layouts
├── services/                # API service setup (Axios instances)
├── store/                   # Redux store and slices
└── vite-env.d.ts            # Vite environment typings
```

## Features

### Client
- Home feed displaying media posts with infinite scroll
- Like and comment on posts
- User profiles and search functionality
- Media upload with support for various media types

### Admin
- Dashboard overview (placeholder)
- Manage users and songs

### Authentication
- Email and password login and registration
- Password reset and change password flows
- Google OAuth login integration

## Getting Started

### Prerequisites
- Node.js (v16 or later recommended)
- npm or yarn package manager

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000` (or the port shown in the terminal)

### Build for Production
```bash
npm run build
```

### Linting
The project uses ESLint with recommended React and TypeScript rules. To run linting:
```bash
npm run lint
```

## Additional Notes
- The app uses React Activation's `KeepAlive` to cache certain client pages for performance.
- Theming is supported with a dark mode default, configurable via local storage.
- API endpoints are accessed via Axios instances configured in `src/services/axios`.

## License
This project is licensed under the MIT License.
