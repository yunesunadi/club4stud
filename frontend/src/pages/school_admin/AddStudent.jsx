import { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { add } from "../../features/student/studentSlice";
import { getAll } from "../../features/batch/batchSlice";
import { useNavigate, useParams } from "react-router-dom";

const validateSchema = Yup.object().shape({
    student_id: Yup.string().required("Student ID is required."),
    name: Yup.string().required("Name is required."),
    email: Yup.string().email("Please enter a valid email.").required("Email is required."),
    phone_number: Yup.number().required("Phone number is required."),
    gender: Yup.string().required("Gender is required."),
    date_of_birth: Yup.date().required("Date of birth is required."),
});

export default function AddBatch() {
    const studentIdRef = useRef();
    const nameRef = useRef();
    const emailRef = useRef();
    const phoneNumberRef = useRef();
    const dateOfBirthRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [gender, setGender] = useState("Male");
    const { batches } = useSelector((store) => store.batch);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "school_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        dispatch(getAll());
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
                const student_id = studentIdRef.current.value;
                const name = nameRef.current.value;
                const email = emailRef.current.value;
                const phone_number = phoneNumberRef.current.value;
                const date_of_birth = dateOfBirthRef.current.value;
                if (!student_id || !name || !email || !phone_number || !gender || !date_of_birth) return false;
                dispatch(add({ student_id, name, email, phone_number, gender, date_of_birth, password: batches.filter(({ _id }) => _id === id)[0].default_password, batch: id }));
                navigate(`/school_admin/batches/students/${id}`);
            }}>
            <label htmlFor="student_id">Student ID</label>
            <input type="text" id="student_id" ref={studentIdRef} value={formik.values.student_id}
                onChange={(e) => handleChange("student_id", e.target.value)} />
            {formik.errors.student_id}
            <br />
            <label htmlFor="name">Name</label>
            <input type="text" id="name" ref={nameRef} value={formik.values.name}
                onChange={(e) => handleChange("name", e.target.value)} />
            {formik.errors.name}
            <br />
            <label htmlFor="email">Email</label>
            <input type="email" id="email" ref={emailRef} value={formik.values.email}
                onChange={(e) => handleChange("email", e.target.value)} />
            {formik.errors.email}
            <br />
            <label htmlFor="phone_number">Phone Number</label>
            <input type="text" id="phone_number" ref={phoneNumberRef} value={formik.values.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)} />
            {formik.errors.phone_number}
            <br />
            <label htmlFor="gender">Gender</label>
            <select name="gender" id="gender" onChange={e => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            <br />
            <label htmlFor="date_of_birth">Date of Birth</label>
            <input type="date" id="date_of_birth" ref={dateOfBirthRef} value={formik.values.date_of_birth}
                onChange={(e) => handleChange("date_of_birth", e.target.value)} />
            {formik.errors.date_of_birth}
            <button type="submit">Add</button>
        </form>
    )
}