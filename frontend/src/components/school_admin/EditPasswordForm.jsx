import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

import { useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../features/schoolAdmin/schoolAdminSlice";

const validateSchema = Yup.object().shape({
    old_password: Yup.string()
        .required("Old password is required.")
        .min(8, "Old password must be 8 or more characters.")
        .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "Old password should contain at least one uppercase and lowercase character.")
        .matches(/\d/, "Old password should contain at least one number.")
        .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "Old password should contain at least one special character."),
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
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        <>
            <Typography color="primary" component="h2">Change Password</Typography>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    const old_password = oldPasswordRef.current.value;
                    const new_password = newPasswordRef.current.value;
                    const confirm_password = confirmPasswordRef.current.value;
                    if (!old_password || !new_password || !confirm_password) return false;
                    dispatch(changePassword({ old_password, new_password }));
                    navigate("/school_admin/dashboard");
                }}>
                <TextField id="old_password" label="Old Password" variant="outlined"
                    type="password"
                    inputRef={oldPasswordRef}
                    value={formik.values.old_password}
                    onChange={(e) => handleChange("old_password", e.target.value)}
                    helperText={formik.errors.old_password}
                    sx={{
                        width: { xs: "100%", sm: 400 }
                    }}
                    margin="normal"
                /><br />
                <TextField id="new_password" label="New Password" variant="outlined"
                    type="password"
                    inputRef={newPasswordRef}
                    value={formik.values.new_password}
                    onChange={(e) => handleChange("new_password", e.target.value)}
                    helperText={formik.errors.new_password}
                    sx={{
                        width: { xs: "100%", sm: 400 }
                    }}
                    margin="normal"
                /><br />
                <TextField id="confirm_password" label="Confirm Password" variant="outlined"
                    type="password"
                    inputRef={confirmPasswordRef}
                    value={formik.values.confirm_password}
                    onChange={(e) => handleChange("confirm_password", e.target.value)}
                    helperText={formik.errors.confirm_password}
                    sx={{
                        width: { xs: "100%", sm: 400 }
                    }}
                    margin="normal"
                /><br />
                <Button type="submit" variant="contained" sx={{ color: "light.main", mt: 2, mb: 3.5 }}>Change</Button>
            </form>
        </>
    )
}