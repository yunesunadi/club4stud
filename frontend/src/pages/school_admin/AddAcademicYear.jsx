import { useRef, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { add } from "../../features/academicYear/academicYearSlice";
import { useNavigate } from "react-router-dom";

const validateSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
});

export default function AddAcademicYears() {
    const nameRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "school_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }
    }, []);

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

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                const name = nameRef.current.value;
                if (!name) return false;
                dispatch(add(name));
                navigate("/school_admin/academic_years");
            }}>
            <input type="text" name="name" ref={nameRef} value={formik.values.name}
                onChange={(e) => handleChange("name", e.target.value)} />
            {formik.errors.name}
            <button type="submit">Add</button>
        </form>
    )
}