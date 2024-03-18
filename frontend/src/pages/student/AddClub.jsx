import { useRef, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { add } from "../../features/club/clubSlice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const validateSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    description: Yup.string().required("Description is required."),
    purpose: Yup.string().required("Purpose is required."),
    member_fees: Yup.number().required("Member fees is required."),
    founded_date: Yup.date().required("Founded date is required."),
    phone_number: Yup.number().required("Phone number is required."),
    email: Yup.string().email("Please enter a valid email.").required("Email is required."),
    password: Yup.string()
        .required("Password is required.")
        .min(8, "Password must be 8 or more characters.")
        .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "Password should contain at least one uppercase and lowercase character.")
        .matches(/\d/, "Password should contain at least one number.")
        .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "Password should contain at least one special character."),
});

export default function AddClub() {
    const nameRef = useRef();
    const descriptionRef = useRef();
    const purposeRef = useRef();
    const memberFeesRef = useRef();
    const foundedDateRef = useRef();
    const phoneNumberRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authUser } = useAuth();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "student") {
                navigate("/");
            }
        } else {
            navigate("/");
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            purpose: "",
            member_fees: "",
            founded_date: "",
            phone_number: "",
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
        <form
            onSubmit={e => {
                e.preventDefault();
                const name = nameRef.current.value;
                const description = descriptionRef.current.value;
                const purpose = purposeRef.current.value;
                const member_fees = memberFeesRef.current.value;
                const founded_date = foundedDateRef.current.value;
                const phone_number = phoneNumberRef.current.value;
                const email = emailRef.current.value;
                const password = passwordRef.current.value;
                if (!name || !description || !purpose || !member_fees || !founded_date || !phone_number || !email || !password) return false;
                dispatch(add({ name, description, purpose, member_fees, founded_date, phone_number, email, password, owner: authUser._id }));
                navigate(`/student/home`);
            }}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" ref={nameRef} value={formik.values.name}
                onChange={(e) => handleChange("name", e.target.value)} />
            {formik.errors.name}
            <br />
            <label htmlFor="description">Description</label>
            <textarea id="description" cols={30} rows={10} ref={descriptionRef} onChange={(e) => handleChange("description", e.target.value)} value={formik.values.description} />
            {formik.errors.description}
            <br />
            <label htmlFor="purpose">Purpose</label>
            <textarea id="purpose" cols={30} rows={10} ref={purposeRef} onChange={(e) => handleChange("purpose", e.target.value)} value={formik.values.purpose} />
            {formik.errors.purpose}
            <br />
            <label htmlFor="member_fees">Member Fees</label>
            <input type="text" id="member_fees" ref={memberFeesRef} value={formik.values.member_fees}
                onChange={(e) => handleChange("member_fees", e.target.value)} />
            {formik.errors.member_fees}
            <br />
            <label htmlFor="founded_date">Founded Date</label>
            <input type="date" id="founded_date" ref={foundedDateRef} value={formik.values.founded_date}
                onChange={(e) => handleChange("founded_date", e.target.value)} />
            {formik.errors.founded_date}
            <br />
            <label htmlFor="phone_number">Phone Number</label>
            <input type="text" id="phone_number" ref={phoneNumberRef} value={formik.values.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)} />
            {formik.errors.phone_number}
            <br />
            <label htmlFor="email">Email</label>
            <input type="email" id="email" ref={emailRef} value={formik.values.email}
                onChange={(e) => handleChange("email", e.target.value)} />
            {formik.errors.email}
            <br />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={passwordRef} value={formik.values.password}
                onChange={(e) => handleChange("password", e.target.value)} />
            {formik.errors.password}
            <br />
            <button type="submit">Add</button>
        </form>
    )
}