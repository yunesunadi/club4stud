import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect } from "react";

export default function Dashboard() {
    const navigate = useNavigate();
    const { setAuth, setAuthUser } = useAuth();

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
            <div>Dashboard</div>
            <button type="button" onClick={() => {
                setAuth(false);
                setAuthUser({});
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/");
            }}>
                Logout
            </button>
        </>
    )
}