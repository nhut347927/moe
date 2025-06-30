// src/App.tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ErrorBoundary from "./components/common/error-boundary";
import { ThemeProvider } from "./components/common/theme-provider-props";
import AppRoutes from "./routers/app-routes";

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
