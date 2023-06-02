import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { StoreContext, store } from "./app/layout/stores/store";
import "./app/layout/styles.css";
import reportWebVitals from "./reportWebVitals";
import { router } from "./app/layout/router/Routes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StoreContext.Provider value={store}>
    <RouterProvider router={router} />
  </StoreContext.Provider>
);

reportWebVitals();
