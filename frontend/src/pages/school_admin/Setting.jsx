import { useEffect } from "react";
import EditEmailForm from "../../components/school_admin/EditEmailForm";
import EditPasswordForm from "../../components/school_admin/EditPasswordForm";
import { useNavigate } from "react-router-dom";

export default function Setting() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "school_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }
    }, []);

    return (
        <>
            <EditEmailForm />
            <EditPasswordForm />
        </>
    )
}