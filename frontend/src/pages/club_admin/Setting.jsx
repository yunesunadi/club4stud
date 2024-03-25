import { useNavigate } from "react-router-dom";
import EditPasswordForm from "../../components/club_admin/EditPasswordForm";
import EditProfileForm from "../../components/club_admin/EditProfileForm";
import { useEffect } from "react";
import { Typography } from "@mui/material";

export default function Setting() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "club_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }
    }, []);

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Setting</Typography>
            <EditProfileForm />
            <EditPasswordForm />
        </>
    )
}