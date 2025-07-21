// src/App.tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ErrorBoundary from "./components/common/error-boundary";
import AppRoutes from "./routers/app-routes";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
