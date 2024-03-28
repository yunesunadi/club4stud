import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useRef, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { add } from "../../features/club/clubSlice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { Typography } from '@mui/material';

const validateSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    description: Yup.string().required("Description is required."),
    purpose: Yup.string().required("Purpose is required."),
    member_fees: Yup.number().required("Member fees is required."),
    founded_date: Yup.date().required("Founded date is required."),
    phone_number: Yup.number().required("Phone number is required."),
    email: Yup.string().email("Please enter a valid email.").required("Email is required."),
    password: Yup.string()
        .required("Password is required.")
        .min(8, "Password must be 8 or more characters.")
        .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "Password should contain at least one uppercase and lowercase character.")
        .matches(/\d/, "Password should contain at least one number.")
        .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "Password should contain at least one special character."),
});

export default function AddClub() {
    const nameRef = useRef();
    const descriptionRef = useRef();
    const purposeRef = useRef();
    const memberFeesRef = useRef();
    const foundedDateRef = useRef();
    const phoneNumberRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authUser } = useAuth();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "student") {
                navigate("/");
            }
        } else {
            navigate("/");
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            purpose: "",
            member_fees: "",
            founded_date: "",
            phone_number: "",
            email: "",
            password: "",
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
            <Typography color="primary" component="h1" variant="h5" mb={1}>Send Club Proposal</Typography>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    const name = nameRef.current.value;
                    const description = descriptionRef.current.value;
                    const purpose = purposeRef.current.value;
                    const member_fees = memberFeesRef.current.value;
                    const founded_date = foundedDateRef.current.value;
                    const phone_number = phoneNumberRef.current.value;
                    const email = emailRef.current.value;
                    const password = passwordRef.current.value;
                    if (!name || !description || !purpose || !member_fees || !founded_date || !phone_number || !email || !password) return false;
                    dispatch(add({ name, description, purpose, member_fees, founded_date, phone_number, email, password, owner: authUser._id }));
                    navigate(`/student/schedules`);
                }}>
                <TextField id="name" label="Name" variant="outlined"
                    inputRef={nameRef}
                    value={formik.values.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    helperText={formik.errors.name}
                    sx={{
                        width: { xs: "100%", sm: 500 },
                    }}
                    margin="normal"
                /><br />
                <TextField id="description" label="Description" variant="outlined"
                    inputRef={descriptionRef}
                    value={formik.values.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    helperText={formik.errors.description}
                    sx={{
                        width: { xs: "100%", sm: 500 }
                    }}
                    margin="normal"
                    multiline
                    minRows={3}
                /><br />
                <TextField id="purpose" label="Purpose" variant="outlined"
                    inputRef={purposeRef}
                    value={formik.values.purpose}
                    onChange={(e) => handleChange("purpose", e.target.value)}
                    helperText={formik.errors.purpose}
                    sx={{
                        width: { xs: "100%", sm: 500 }
                    }}
                    margin="normal"
                /><br />
                <TextField id="member_fees" label="Member Fees" variant="outlined"
                    type="number"
                    inputRef={memberFeesRef}
                    value={formik.values.member_fees}
                    onChange={(e) => handleChange("member_fees", e.target.value)}
                    helperText={formik.errors.member_fees}
                    sx={{
                        width: { xs: "100%", sm: 500 }
                    }}
                    margin="normal"
                /><br />
                <TextField id="founded_date" label="Founded Date" variant="outlined"
                    type="date"
                    inputRef={foundedDateRef}
                    value={formik.values.founded_date}
                    onChange={(e) => handleChange("founded_date", e.target.value)}
                    helperText={formik.errors.founded_date}
                    sx={{
                        width: { xs: "100%", sm: 500 },
                        "& label.Mui-focused": {
                            color: "secondary.main",
                        },
                        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "secondary.light",
                            borderWidth: 1.5,
                        },
                    }}
                    margin="normal"
                    focused
                /><br />
                <TextField id="phone_number" label="Phone Number" variant="outlined"
                    inputRef={phoneNumberRef}
                    value={formik.values.phone_number}
                    onChange={(e) => handleChange("phone_number", e.target.value)}
                    helperText={formik.errors.phone_number}
                    sx={{
                        width: { xs: "100%", sm: 500 }
                    }}
                    margin="normal"
                /><br />
                <TextField id="email" label="Email" variant="outlined"
                    type="email"
                    inputRef={emailRef}
                    value={formik.values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    helperText={formik.errors.email}
                    sx={{
                        width: { xs: "100%", sm: 500 }
                    }}
                    margin="normal"
                /><br />
                <TextField id="password" label="Password" variant="outlined"
                    type="password"
                    inputRef={passwordRef}
                    value={formik.values.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    helperText={formik.errors.password}
                    sx={{
                        width: { xs: "100%", sm: 500 }
                    }}
                    margin="normal"
                /><br />
                <Button type="submit" variant="contained" sx={{ color: "light.main", mt: 2, mb: 3.5 }}>Send</Button>
            </form>
        </>
    )
}