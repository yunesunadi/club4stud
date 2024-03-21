import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Error from "./pages/Error";
import SchoolDashboard from "./pages/school_admin/Dashboard";
import Home from "./pages/student/Home";
import AcademicYears from "./pages/school_admin/AcademicYears";
import Batches from "./pages/school_admin/Batches";
import Students from "./pages/school_admin/Students";
import BatchStudents from "./pages/school_admin/BatchStudents";
import AddClub from "./pages/student/AddClub";
import ClubProposals from "./pages/school_admin/ClubProposals";
import ApprovedProposals from "./pages/school_admin/ApprovedProposals";
import DeclinedProposals from "./pages/school_admin/DeclinedProposals";
import StudentClubs from "./pages/student/Clubs";
import RequestedClubs from "./pages/student/RequestedClubs";
import ClubDashboard from "./pages/club_admin/Dashboard";
import ClubMembers from "./pages/club_admin/ClubMembers";
import JoinedMembers from "./pages/club_admin/JoinedMembers";
import SchoolClubs from "./pages/school_admin/Clubs";
import ClubSchedules from "./pages/club_admin/Schedules";
import AddSchedule from "./pages/club_admin/AddSchedule";
import EditSchedule from "./pages/club_admin/EditSchedule";
import StudentSchedules from "./pages/student/Schedules";
import Attendance from "./pages/club_admin/Attendance";
import SchoolSetting from "./pages/school_admin/Setting";
import ClubSetting from "./pages/club_admin/Setting";
import StudentSetting from "./pages/student/Setting";
import SchoolAdminLayout from "./SchoolAdminLayout";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="school_admin" element={<SchoolAdminLayout />}>
                    <Route path="dashboard" element={<SchoolDashboard />} />
                    <Route path="academic_years">
                        <Route index element={<AcademicYears />} />
                        {/* <Route path="create" element={<AddAcademicYear />} /> */}
                        {/* <Route path="edit/:id" element={<EditAcademicYear />} /> */}
                    </Route>
                    <Route path="batches">
                        <Route index element={<Batches />} />
                        {/* <Route path="create" element={<AddBatch />} /> */}
                        {/* <Route path="edit/:id" element={<EditBatch />} /> */}
                        <Route path="students/:id" element={<BatchStudents />} />
                        {/* <Route path="students/create/:id" element={<AddStudent />} /> */}
                        {/* <Route path="students/:bid/edit/:id" element={<EditStudent />} /> */}
                    </Route>
                    <Route path="students">
                        <Route index element={<Students />} />
                    </Route>
                    <Route path="club_proposals">
                        <Route index element={<ClubProposals />} />
                        <Route path="approved" element={<ApprovedProposals />} />
                        <Route path="declined" element={<DeclinedProposals />} />
                    </Route>
                    <Route path="clubs" element={<SchoolClubs />} />
                    <Route path="setting" element={<SchoolSetting />} />
                </Route>
                <Route path="student">
                    <Route path="home" element={<Home />} />
                    <Route path="clubs">
                        <Route index element={<StudentClubs />} />
                        <Route path="requested" element={<RequestedClubs />} />
                        <Route path="send_proposal" element={<AddClub />} />
                    </Route>
                    <Route path="schedules">
                        <Route index element={<StudentSchedules />} />
                    </Route>
                    <Route path="setting" element={<StudentSetting />} />
                </Route>
                <Route path="club_admin">
                    <Route path="dashboard" element={<ClubDashboard />} />
                    <Route path="club">
                        <Route path="members">
                            <Route index element={<ClubMembers />} />
                            <Route path="joined" element={<JoinedMembers />} />
                        </Route>
                        <Route path="schedules">
                            <Route index element={<ClubSchedules />} />
                            <Route path="create" element={<AddSchedule />} />
                            <Route path="edit/:id" element={<EditSchedule />} />
                            <Route path="attendance/:id" element={<Attendance />} />
                        </Route>
                    </Route>
                    <Route path="setting" element={<ClubSetting />} />
                </Route>
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    )
}