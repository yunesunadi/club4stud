import { useNavigate } from "react-router-dom";
import EditPasswordForm from "../../components/student/EditPasswordForm";
import { useEffect } from "react";

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
            <EditPasswordForm />
        </>
    )
}