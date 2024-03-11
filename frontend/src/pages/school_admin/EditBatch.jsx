import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { update } from "../../features/batch/batchSlice";
import { getAll } from "../../features/academicYear/academicYearSlice";

const validateSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    default_password: Yup.string().required("Default password is required."),
});

export default function EditBatch() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [batch, setBatch] = useState({});
    const nameRef = useRef();
    const foundedDateRef = useRef();
    const defaultPasswordRef = useRef();
    const { academicYears } = useSelector((store) => store.academicYear);

    useEffect(() => {
        (async () => {
            const api = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/api/batches/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data } = await res.json();
            setBatch(data);
        })();

        dispatch(getAll());
    }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
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
                const { name, founded_date, default_password, academic_year } = batch;
                if (!name || !founded_date || !default_password || !academic_year) return false;
                dispatch(update({ _id: id, name, founded_date, default_password, academic_year }));
                navigate("/school_admin/batches");
            }}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" defaultValue={batch.name} ref={nameRef}
                onChange={(e) => {
                    handleChange("name", e.target.value);
                    const name = nameRef.current.value;
                    setBatch({ ...batch, name });
                }} />
            {batch.name === "" && formik.errors.name}
            <label htmlFor="founded_date">Founded Date</label>
            <input type="date" id="founded_date" defaultValue={batch.founded_date} ref={foundedDateRef}
                onChange={(e) => {
                    handleChange("founded_date", e.target.value);
                    const founded_date = foundedDateRef.current.value;
                    setBatch({ ...batch, founded_date });
                }} />
            <label htmlFor="default_password">Default Password</label>
            <input type="text" id="default_password" defaultValue={batch.default_password} ref={defaultPasswordRef}
                onChange={(e) => {
                    handleChange("default_password", e.target.value);
                    const default_password = defaultPasswordRef.current.value;
                    setBatch({ ...batch, default_password });
                }} />
            {batch.default_password === "" && formik.errors.default_password}
            <select name="academic_year" id="academic_year" value={batch.academic_year} onChange={e =>
                setBatch({ ...batch, academic_year: e.target.value })}>
                {academicYears.map(({ _id, name }) => <option key={_id} value={_id}>{name}</option>)}
            </select>
            <button type="submit">Edit</button>
        </form>
    )
}