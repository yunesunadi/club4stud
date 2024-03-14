import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Error from "./pages/Error";
import SchoolDashboard from "./pages/school_admin/Dashboard";
import Home from "./pages/student/Home";
import AcademicYears from "./pages/school_admin/AcademicYears";
import AddAcademicYear from "./pages/school_admin/AddAcademicYear";
import EditAcademicYear from "./pages/school_admin/EditAcademicYear";
import Batches from "./pages/school_admin/Batches";
import AddBatch from "./pages/school_admin/AddBatch";
import EditBatch from "./pages/school_admin/EditBatch";
import Students from "./pages/school_admin/Students";
import AddStudent from "./pages/school_admin/AddStudent";
import EditStudent from "./pages/school_admin/EditStudent";
import BatchStudents from "./pages/school_admin/BatchStudents";
import AddClub from "./pages/student/AddClub";
import ClubProposals from "./pages/school_admin/ClubProposals";
import ApprovedProposals from "./pages/school_admin/ApprovedProposals";
import DeclinedProposals from "./pages/school_admin/DeclinedProposals";
import Clubs from "./pages/student/Clubs";
import RequestedClubs from "./pages/student/RequestedClubs";
import ClubDashboard from "./pages/club_admin/Dashboard";
import ClubMembers from "./pages/club_admin/ClubMembers";
import JoinedMembers from "./pages/club_admin/JoinedMembers";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="school_admin">
                    <Route path="dashboard" element={<SchoolDashboard />} />
                    <Route path="academic_years">
                        <Route index element={<AcademicYears />} />
                        <Route path="create" element={<AddAcademicYear />} />
                        <Route path="edit/:id" element={<EditAcademicYear />} />
                    </Route>
                    <Route path="batches">
                        <Route index element={<Batches />} />
                        <Route path="create" element={<AddBatch />} />
                        <Route path="edit/:id" element={<EditBatch />} />
                        <Route path="students/:id" element={<BatchStudents />} />
                        <Route path="students/create/:id" element={<AddStudent />} />
                        <Route path="students/:bid/edit/:id" element={<EditStudent />} />
                    </Route>
                    <Route path="students">
                        <Route index element={<Students />} />
                    </Route>
                    <Route path="club_proposals">
                        <Route index element={<ClubProposals />} />
                        <Route path="approved" element={<ApprovedProposals />} />
                        <Route path="declined" element={<DeclinedProposals />} />
                    </Route>
                </Route>
                <Route path="student">
                    <Route path="home" element={<Home />} />
                    <Route path="clubs">
                        <Route index element={<Clubs />} />
                        <Route path="requested" element={<RequestedClubs />} />
                        <Route path="send_proposal" element={<AddClub />} />
                    </Route>
                </Route>
                <Route path="club_admin">
                    <Route path="dashboard" element={<ClubDashboard />} />
                    <Route path="clubs">
                        <Route path="members">
                            <Route index element={<ClubMembers />} />
                            <Route path="joined" element={<JoinedMembers />} />
                        </Route>
                    </Route>
                </Route>
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    )
}