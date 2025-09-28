import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppKitProvider } from './lib/AppKitProvider'

createRoot(document.getElementById("root")!).render(
  <AppKitProvider>
    <App />
  </AppKitProvider>
);
