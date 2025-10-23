import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/global.css"; // ✅ Lägg till denna rad så att variablerna laddas globalt

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
});
