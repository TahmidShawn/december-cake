import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import Router from "./router/Router";
import { LanguageProvider } from "./context/LanguageContext";
import QueryProvider from "./providers/QueryProvider";
import AuthProvider from "./context/AuthProvider";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <QueryProvider>
                <LanguageProvider>
                    <AuthProvider>
                        <Router />
                    </AuthProvider>
                </LanguageProvider>
            </QueryProvider>
        </BrowserRouter>
    </StrictMode>,
);
