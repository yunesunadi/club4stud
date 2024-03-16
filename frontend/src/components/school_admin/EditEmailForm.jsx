import { useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { changeEmail } from "../../features/schoolAdmin/schoolAdminSlice";

const validateSchema = Yup.object().shape({
    email: Yup.string().email("Please enter a valid email.").required("Email is required."),
});

export default function EditEmailForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const emailRef = useRef();

    const formik = useFormik({
        initialValues: {
            email: "",
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
                const email = emailRef.current.value;
                if (!email) return false;
                dispatch(changeEmail({ email }));
                navigate("/school_admin/dashboard");
            }}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" ref={emailRef}
                onChange={(e) => {
                    handleChange("email", e.target.value);
                }} />
            {formik.errors.email}
            <button type="submit">Change Email</button>
        </form>
    )
}