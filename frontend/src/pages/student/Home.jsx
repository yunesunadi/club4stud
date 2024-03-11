import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

export default function Home() {
    const { setAuth, setAuthUser } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <h2>Student Home</h2>
            <button type="button" onClick={() => {
                setAuth(false);
                setAuthUser({});
                localStorage.removeItem("token");
                navigate("/");
            }}>
                Logout
            </button>
        </>
    );
}