import "./assets/style/index.css";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/store";
import { FilterProvider } from "./common/context/filter-context";
import { AliveScope } from "react-activation";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <FilterProvider>
        <AliveScope>
          <App />
        </AliveScope>
      </FilterProvider>
    </Provider>
  </StrictMode>
);
