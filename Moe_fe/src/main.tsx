import "./assets/style/index.css";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/temp";
import { FilterProvider } from "./common/context/filter-context";
import { AliveScope } from "react-activation";
import { ThemeProvider } from "./components/common/theme-provider";

const root = ReactDOM.createRoot(document.getElementById("root")!);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

root.render(
  <StrictMode>
    <Provider store={store}>
      <FilterProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AliveScope>
            <App />
          </AliveScope>
        </ThemeProvider>
      </FilterProvider>
    </Provider>
  </StrictMode>
);
