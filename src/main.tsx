import React from "react";
import ReactDOM from "react-dom/client";
import { Scene } from "./Scene";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Scene />
    </React.StrictMode>
  );
}
