import { useNavigate } from "react-router-dom";
import EditPasswordForm from "../../components/club_admin/EditPasswordForm";
import EditProfileForm from "../../components/club_admin/EditProfileForm";
import { useEffect } from "react";

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
            <EditProfileForm />
            <EditPasswordForm />
        </>
    )
}