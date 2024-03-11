import { useRef, useState, useCallback } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import loginImg from "../assets/images/login.png";
import RadioBtn from "../styled_components/RadioBtn";

const validateSchema = Yup.object().shape({
    email: Yup.string().email("Please enter a valid email.").required("Email is required."),
    password: Yup.string().required("Password is required."),
});

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [loginErr, setLoginErr] = useState(false);
    const [role, setRole] = useState("student");
    const { setAuth, setAuthUser } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validateSchema,
    });

    const handleChange = useCallback(
        (key, value) =>
            formik.setValues({
                ...formik.values,
                [key]: value,
            }),
        [formik]
    );

    return (
        <div className="bg-slate-100 flex justify-center items-center h-screen overflow-hidden">
            <div className="w-1/2 h-screen hidden lg:block">
                <img src={loginImg} alt="Login image" className="object-cover w-full h-full" />
            </div>
            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-2xl font-semibold mb-4 text-center text-gradient">Welcome to Club4Stud</h1>
                {loginErr && <div className="flex justify-center items-center bg-slate-200 p-2 rounded-md border-slate-500 border-[1px] mb-2 ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-500 mt-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <p className="text-slate-600 pl-1.5">Incorrect email or password</p>
                </div>}
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
                    <div className="mb-2">
                        <label htmlFor="email" className="block text-slate-600 mb-2 font-semibold">Email</label>
                        <input type="email" placeholder="name@example.com" className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" ref={emailRef} value={formik.values.email}
                            onChange={(e) => handleChange("email", e.target.value)} />
                        <p className="mt-1 text-slate-600 text-sm">
                            {formik.errors.email}
                        </p>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-slate-600 mb-2 font-semibold">Password</label>
                        <input type="password" className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" ref={passwordRef} value={formik.values.password}
                            onChange={(e) => handleChange("password", e.target.value)} />
                        <p className="mt-1 text-slate-600 text-sm">
                            {formik.errors.password}
                        </p>
                    </div>
                    <button type="submit" className="bg-gradient text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
                </form>
            </div>
        </div>
    )
}