import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Error from "./pages/Error";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    )
}