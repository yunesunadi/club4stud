import { useNavigate } from "react-router-dom";
import EditPasswordForm from "../../components/student/EditPasswordForm";
import { useEffect } from "react";

import { Typography } from "@mui/material";

export default function Setting() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "student") {
                navigate("/");
            }
        } else {
            navigate("/");
        }
    }, []);

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Setting</Typography>
            <EditPasswordForm />
        </>
    )
}