import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { update } from "../../features/academicYear/academicYearSlice";

const validateSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
});

export default function EditAcademicYear() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [academicYear, setAcademicYear] = useState({});
    const nameRef = useRef();

    const formik = useFormik({
        initialValues: {
            name: ""
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

    useEffect(() => {
        (async () => {
            const api = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/api/academic_years/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data } = await res.json();
            setAcademicYear(data);
        })();
    }, []);

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (!academicYear.name) return false;
                dispatch(update({ _id: id, name: academicYear.name }));
                navigate("/school_admin/academic_years");
            }}>
            <input type="text" name="name" defaultValue={academicYear.name} ref={nameRef}
                onChange={(e) => {
                    handleChange("name", e.target.value);
                    const name = nameRef.current.value;
                    setAcademicYear({ ...academicYear, name });
                }} />
            {formik.errors.name}
            <button type="submit">Edit</button>
        </form>
    )
}