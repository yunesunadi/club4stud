import "@fontsource-variable/lora";

import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function SchoolAdminLayout() {
    return (
        <>
            <Container maxWidth="lg">
                <Outlet />
            </Container>
        </>
    )
}