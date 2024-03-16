import { useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updatePassword } from "../../features/student/studentSlice";

const validateSchema = Yup.object().shape({
    old_password: Yup.string()
        .required("Old password is required."),
    // .min(8, "Old password must be 8 or more characters.")
    // .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "Old password should contain at least one uppercase and lowercase character.")
    // .matches(/\d/, "Old password should contain at least one number.")
    // .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "Old password should contain at least one special character."),
    new_password: Yup.string()
        .required("New password is required.")
        .min(8, "New password must be 8 or more characters.")
        .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "New password should contain at least one uppercase and lowercase character.")
        .matches(/\d/, "New password should contain at least one number.")
        .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "New password should contain at least one special character."),
    confirm_password: Yup.string().when("new_password", (password, field) => {
        if (password) {
            return field.required("The two passwords do not match.").oneOf([Yup.ref("new_password")], "The two passwords do not match.");
        }
    }),
});

export default function EditPasswordForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const oldPasswordRef = useRef();
    const newPasswordRef = useRef();
    const confirmPasswordRef = useRef();

    const formik = useFormik({
        initialValues: {
            old_password: "",
            new_password: "",
            confirm_password: "",
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
                const old_password = oldPasswordRef.current.value;
                const new_password = newPasswordRef.current.value;
                const confirm_password = confirmPasswordRef.current.value;
                if (!old_password || !new_password || !confirm_password) return false;
                dispatch(updatePassword({ old_password, new_password }));
                navigate("/student/home");
            }}>
            <label htmlFor="old_password">Old Password</label>
            <input type="password" id="old_password" ref={oldPasswordRef}
                onChange={(e) => {
                    handleChange("old_password", e.target.value);
                }} />
            {formik.errors.old_password}
            <br />
            <label htmlFor="new_password">New Password</label>
            <input type="password" id="new_password" ref={newPasswordRef}
                onChange={(e) => {
                    handleChange("new_password", e.target.value);
                }} />
            {formik.errors.new_password}
            <br />
            <label htmlFor="confirm_password">Confirm New Password</label>
            <input type="password" id="confirm_password" ref={confirmPasswordRef}
                onChange={(e) => {
                    handleChange("confirm_password", e.target.value);
                }} />
            {formik.errors.confirm_password}
            <br />
            <button type="submit">Change Password</button>
        </form>
    )
}