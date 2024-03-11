import loginImg from "../assets/images/login.png";
import { useRef, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import RadioBtn from "../styled_components/RadioBtn";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [loginErr, setLoginErr] = useState(false);
    const [role, setRole] = useState("student");
    const { setAuth, setAuthUser } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="bg-slate-100 flex justify-center items-center h-screen overflow-hidden">
            <div className="w-1/2 h-screen hidden lg:block">
                <img src={loginImg} alt="Login image" className="object-cover w-full h-full" />
            </div>
            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-2xl font-semibold mb-4 text-center text-gradient">Welcome to Club4Stud</h1>
                {loginErr && <p>Incorrect email or password</p>}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const email = emailRef.current.value;
                    const password = passwordRef.current.value;

                    (async () => {
                        const api = import.meta.env.VITE_API_URL;
                        const res = await fetch(`${api}/api/login`, {
                            method: "POST",
                            body: JSON.stringify({ email, password, role }),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });

                        if (!res.ok) {
                            setLoginErr(true);
                            return false;
                        }

                        const data = await res.json();
                        localStorage.setItem("token", data.token);

                        fetch(`${api}/api/verify`, {
                            headers: {
                                Authorization: `Bearer ${data.token}`,
                            },
                        })
                            .then(res => res.json())
                            .then(user => {
                                setAuth(true);
                                setAuthUser(user);

                                if (user.role === "school_admin") {
                                    navigate("/school_admin/dashboard");
                                } else if (user.role === "club_admin") {
                                    navigate("/club_admin/dashboard");
                                } else if (user.role === "student") {
                                    navigate("/student/home");
                                }
                            });
                    })();
                }}>
                    <div className="mb-2">
                        <p className="text-slate-600 font-semibold">Role</p>
                        <RadioBtn text="student" label="Student" role={role} setRole={setRole} />
                        <RadioBtn text="club_admin" label="Club Admin" role={role} setRole={setRole} />
                        <RadioBtn text="school_admin" label="School Admin" role={role} setRole={setRole} />

                    </div>

                    <label className="block">
                        <p className="text-slate-600 mb-2 font-semibold">Email</p>
                        <input type="email" placeholder="name@example.com" className="peer w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" ref={emailRef} />
                        <p className="mt-1 invisible peer-invalid:visible text-slate-600 text-sm">
                            Please provide a valid email address.
                        </p>
                    </label>
                    <div className="mb-8">
                        <label htmlFor="password" className="block text-slate-600 mb-2 font-semibold">Password</label>
                        <input type="password" className="peer w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" ref={passwordRef} />
                        <p className="mt-1 invisible peer-invalid:visible text-slate-600 text-sm">
                        </p>
                    </div>
                    <button type="submit" className="bg-gradient text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
                </form>
            </div>
        </div>
    )
}