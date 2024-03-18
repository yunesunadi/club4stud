import "@fontsource-variable/lora";

import { Container } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export default function SchoolAdminLayout() {
    return (
        <>
            <Link to="academic_years">Academic Years</Link>
            <Container maxWidth="lg">
                <Outlet />
            </Container>
        </>
    )
}