import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./providers/AuthProvider";
import { store } from "./store";
import { Provider } from "react-redux";
import AppThemeProvider from "./providers/AppThemeProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <Provider store={store}>
                <AppThemeProvider>
                    <App />
                </AppThemeProvider>
            </Provider>
        </AuthProvider>
    </React.StrictMode>,
)
