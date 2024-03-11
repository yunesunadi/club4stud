import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Error from "./pages/Error";
import Dashboard from "./pages/school_admin/Dashboard";
import Home from "./pages/student/Home";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="school_admin/dashboard" element={<Dashboard />} />
                <Route path="student/home" element={<Home />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    )
}