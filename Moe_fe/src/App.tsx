// src/App.tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { ThemeProvider } from "./components/common/ThemeProviderProps";
import AppRoutes from "./routers/AppRoutes";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
