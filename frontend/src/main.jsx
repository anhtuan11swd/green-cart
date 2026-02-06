import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RootRouter from "./RootRouter.jsx";

// Điểm khởi đầu của ứng dụng React - mount component gốc vào DOM
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootRouter />
  </StrictMode>,
);
