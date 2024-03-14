import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

export default function Dashboard() {
    const navigate = useNavigate();
    const { setAuth, setAuthUser } = useAuth();
    return (
        <>
            <div>Dashboard</div>
            <button type="button" onClick={() => {
                setAuth(false);
                setAuthUser({});
                localStorage.removeItem("token");
                navigate("/");
            }}>
                Logout
            </button>
        </>
    )
}