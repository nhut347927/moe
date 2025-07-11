import "./assets/style/index.css";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/Store";
import { FilterProvider } from "./common/context/FilterContext";
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
