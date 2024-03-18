import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect } from "react";

export default function Home() {
    const { setAuth, setAuthUser } = useAuth();
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
            <h2>Student Home</h2>
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
    );
}