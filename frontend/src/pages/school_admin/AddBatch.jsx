import { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { add } from "../../features/batch/batchSlice";
import { getAll } from "../../features/academicYear/academicYearSlice";
import { useNavigate } from "react-router-dom";

const validateSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    founded_date: Yup.date().required("Founded date is required."),
    default_password: Yup.string().required("Default password is required."),
});

export default function AddBatch() {
    const nameRef = useRef();
    const foundedDateRef = useRef();
    const defaultPasswordRef = useRef();
    const [academicYear, setAcademicYear] = useState("");
    const { academicYears } = useSelector((store) => store.academicYear);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAll());
    }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
            founded_date: "",
            default_password: ""
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
                const founded_date = foundedDateRef.current.value;
                const default_password = defaultPasswordRef.current.value;
                if (!name || !founded_date || !default_password || !academicYear) return false;
                dispatch(add({ name, founded_date, default_password, academic_year: academicYear }));
                navigate("/school_admin/batches");
            }}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" ref={nameRef} value={formik.values.name}
                onChange={(e) => handleChange("name", e.target.value)} />
            {formik.errors.name}
            <label htmlFor="founded_date">Founded Date</label>
            <input type="date" id="founded_date" ref={foundedDateRef} value={formik.values.founded_date}
                onChange={(e) => handleChange("founded_date", e.target.value)} />
            {formik.errors.founded_date}
            <label htmlFor="default_password">Default Password</label>
            <input type="text" id="default_password" ref={defaultPasswordRef} value={formik.values.default_password}
                onChange={(e) => handleChange("default_password", e.target.value)} />
            {formik.errors.default_password}
            <label htmlFor="academic_year">Academic Year</label>
            <select name="academic_year" id="academic_year" onChange={e => setAcademicYear(e.target.value)}>
                {academicYears.map(({ _id, name }) => <option key={_id} value={_id}>{name}</option>)}
            </select>
            <button type="submit">Add</button>
        </form>
    )
}