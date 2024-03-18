import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Alert from '@mui/material/Alert';

import EmailIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useRef, useState, useCallback } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import loginImg from "../assets/images/login.png";

const validateSchema = Yup.object().shape({
    email: Yup.string().email("Please enter a valid email.").required("Email is required."),
    password: Yup.string().required("Password is required."),
});

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const emailRef = useRef();
    const passwordRef = useRef();
    const [loginErr, setLoginErr] = useState(false);
    const [role, setRole] = useState("student");
    const { setAuth, setAuthUser } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        (async () => {
            const api = import.meta.env.VITE_API_URL;
            const res = await fetch(`${api}/api/login`, {
                method: "POST",
                body: JSON.stringify({ email, password, role }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                setLoginErr(true);
                return false;
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", role);

            fetch(`${api}/api/verify`, {
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            })
                .then(res => res.json())
                .then(user => {
                    setAuth(true);
                    setAuthUser(user);

                    if (user.role === "school_admin") {
                        navigate("/school_admin/dashboard");
                    } else if (user.role === "club_admin") {
                        navigate("/club_admin/dashboard");
                    } else if (user.role === "student") {
                        navigate("/student/home");
                    }
                });
        })();
    }

    return (
        <Grid container component="main" sx={{ height: "100vh" }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                md={5}
                lg={6}
                sx={{
                    backgroundImage: `url(${loginImg})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <Grid item xs={12} md={7} lg={6} component={Paper} square sx={{
                backgroundColor: "background.main",
            }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                        mx: { xs: 6, sm: 8, lg: 12 },
                    }}
                >
                    <Typography component="h1" variant="h4" color="primary" mb={3}>
                        Welcome to Club4Stud
                    </Typography>
                    {loginErr && <Alert severity="info" sx={{ width: "100%", mb: 2 }}>Incorrect role, email or password</Alert>}
                    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
                        <ToggleButtonGroup
                            color="primary"
                            value={role}
                            exclusive
                            onChange={(e, newRole) => setRole(newRole)}
                            sx={{
                                mb: 2
                            }}
                        >
                            <ToggleButton value="student">Student</ToggleButton>
                            <ToggleButton value="club_admin">Club Admin</ToggleButton>
                            <ToggleButton value="school_admin">School Admin</ToggleButton>
                        </ToggleButtonGroup>
                        <TextField
                            variant="standard"
                            margin="normal"
                            fullWidth
                            label="Email Address"
                            autoFocus
                            type="email"
                            placeholder="name@example.com"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                            inputRef={emailRef}
                            value={formik.values.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            helperText={formik.errors.email}
                        />
                        <TextField
                            variant="standard"
                            margin="normal"
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end" >
                                        <IconButton
                                            onClick={() => setShowPassword((show) => !show)}
                                            onMouseDown={(e) => e.preventDefault()}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            inputRef={passwordRef} value={formik.values.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            helperText={formik.errors.password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, color: "light.main" }}
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid >
    );
}