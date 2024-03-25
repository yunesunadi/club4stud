import { useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { changeEmail } from "../../features/schoolAdmin/schoolAdminSlice";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

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
        <>
            <Typography color="primary" component="h2">Change Email</Typography>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    const email = emailRef.current.value;
                    if (!email) return false;
                    dispatch(changeEmail({ email }));
                    navigate("/school_admin/dashboard");
                }}>
                <TextField id="email" label="Email" variant="outlined"
                    type="email"
                    inputRef={emailRef}
                    value={formik.values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    helperText={formik.errors.email}
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