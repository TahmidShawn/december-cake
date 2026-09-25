import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import Router from "./router/Router";
import { LanguageProvider } from "./context/LanguageContext";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <LanguageProvider>
                <Router />
            </LanguageProvider>
        </BrowserRouter>
    </StrictMode>,
);
