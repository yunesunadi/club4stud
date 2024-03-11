import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Error from "./pages/Error";
import Dashboard from "./pages/school_admin/Dashboard";
import Home from "./pages/student/Home";
import AcademicYears from "./pages/school_admin/AcademicYears";
import AddAcademicYear from "./pages/school_admin/AddAcademicYear";
import EditAcademicYear from "./pages/school_admin/EditAcademicYear";
import Batches from "./pages/school_admin/Batches";
import AddBatch from "./pages/school_admin/AddBatch";
import EditBatch from "./pages/school_admin/EditBatch";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="school_admin">
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="academic_years">
                        <Route index element={<AcademicYears />} />
                        <Route path="create" element={<AddAcademicYear />} />
                        <Route path="edit/:id" element={<EditAcademicYear />} />
                    </Route>
                    <Route path="batches">
                        <Route index element={<Batches />} />
                        <Route path="create" element={<AddBatch />} />
                        <Route path="edit/:id" element={<EditBatch />} />
                    </Route>
                </Route>
                <Route path="student/home" element={<Home />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    )
}