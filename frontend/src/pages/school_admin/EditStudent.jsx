import { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { update } from "../../features/student/studentSlice";
import { useNavigate, useParams } from "react-router-dom";

const validateSchema = Yup.object().shape({
    student_id: Yup.string().required("Student ID is required."),
    name: Yup.string().required("Name is required."),
    email: Yup.string().email("Please enter a valid email.").required("Email is required."),
    phone_number: Yup.number().required("Phone number is required."),
    gender: Yup.string().required("Gender is required."),
    date_of_birth: Yup.date().required("Date of birth is required."),
});

export default function EditStudent() {
    const { bid, id } = useParams();
    const studentIdRef = useRef();
    const nameRef = useRef();
    const emailRef = useRef();
    const phoneNumberRef = useRef();
    const dateOfBirthRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [student, setStudent] = useState({});

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "school_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        (async () => {
            const api = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/api/students/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data } = await res.json();
            setStudent(data);
        })();
    }, []);

    const formik = useFormik({
        initialValues: {
            student_id: "",
            name: "",
            email: "",
            phone_number: "",
            gender: "",
            date_of_birth: "",
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
                const { student_id, name, email, phone_number, gender, date_of_birth, password, batch } = student;
                if (!student_id || !name || !email || !phone_number || !gender || !date_of_birth) return false;
                dispatch(update({ _id: id, student_id, name, email, phone_number, gender, date_of_birth, password, batch }));
                navigate(`/school_admin/batches/students/${bid}`);
            }}>
            <label htmlFor="student_id">Student ID</label>
            <input type="text" id="student_id" ref={studentIdRef} defaultValue={student.student_id}
                onChange={(e) => {
                    handleChange("student_id", e.target.value);
                    const student_id = studentIdRef.current.value;
                    setStudent({ ...student, student_id });
                }} />
            {student.student_id === "" && formik.errors.student_id}
            <br />
            <label htmlFor="name">Name</label>
            <input type="text" id="name" ref={nameRef} defaultValue={student.name}
                onChange={(e) => {
                    handleChange("name", e.target.value);
                    const name = nameRef.current.value;
                    setStudent({ ...student, name });
                }} />
            {student.name === "" && formik.errors.name}
            <br />
            <label htmlFor="email">Email</label>
            <input type="email" id="email" ref={emailRef} defaultValue={student.email}
                onChange={(e) => {
                    handleChange("email", e.target.value);
                    const email = emailRef.current.value;
                    setStudent({ ...student, email });
                }} />
            {student.email === "" && formik.errors.email}
            <br />
            <label htmlFor="phone_number">Phone Number</label>
            <input type="text" id="phone_number" ref={phoneNumberRef} defaultValue={student.phone_number}
                onChange={(e) => {
                    handleChange("phone_number", e.target.value);
                    const phone_number = phoneNumberRef.current.value;
                    setStudent({ ...student, phone_number });
                }} />
            {student.phone_number === "" && formik.errors.phone_number}
            <br />
            <label htmlFor="gender">Gender</label>
            <select name="gender" id="gender" value={student.gender} onChange={e =>
                setStudent({ ...student, gender: e.target.value })}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            <br />
            <label htmlFor="date_of_birth">Date of Birth</label>
            <input type="date" id="date_of_birth" ref={dateOfBirthRef} defaultValue={student.date_of_birth}
                onChange={(e) => {
                    handleChange("date_of_birth", e.target.value);
                    const date_of_birth = dateOfBirthRef.current.value;
                    setStudent({ ...student, date_of_birth });
                }} />
            {student.date_of_birth === "" && formik.errors.date_of_birth}
            <button type="submit">Edit</button>
        </form>
    )
}