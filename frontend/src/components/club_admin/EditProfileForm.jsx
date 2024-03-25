import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { update } from "../../features/club/clubSlice";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

const validateSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    description: Yup.string().required("Description is required."),
    purpose: Yup.string().required("Purpose is required."),
    member_fees: Yup.number().required("Member fees is required."),
    founded_date: Yup.date().required("Founded date is required."),
    phone_number: Yup.number().required("Phone number is required."),
    email: Yup.string().email("Please enter a valid email.").required("Email is required."),
});

export default function EditEmailForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const initialValues = {
        name: "",
        description: "",
        purpose: "",
        member_fees: "",
        founded_date: "",
        phone_number: "",
        email: "",
    };
    const [club, setClub] = useState(initialValues);

    useEffect(() => {
        (async () => {
            const api = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/api/clubs/auth`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data } = await res.json();
            setClub(data);
        })();
    }, []);

    const formik = useFormik({
        initialValues,
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
            <Typography color="primary" component="h2">Edit Profile</Typography>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    const { name, description, purpose, member_fees, founded_date, phone_number, email } = club;
                    if (!name || !description || !purpose || !member_fees || !founded_date || !phone_number || !email) return false;
                    dispatch(update({ name, description, purpose, member_fees, founded_date, phone_number, email }));
                    navigate(`/club_admin/dashboard`);
                }}>
                <TextField id="name" label="Name" variant="outlined"
                    value={club.name}
                    onChange={(e) => {
                        handleChange("name", e.target.value);
                        setClub({ ...club, name: e.target.value });
                    }}
                    helperText={club.name === "" && formik.errors.name}
                    sx={{
                        width: { xs: "100%", sm: 500 },
                    }}
                    margin="normal"
                /><br />
                <TextField id="description" label="Description" variant="outlined"
                    value={club.description}
                    onChange={(e) => {
                        handleChange("description", e.target.value);
                        setClub({ ...club, description: e.target.value });
                    }}
                    helperText={club.description === "" && formik.errors.description}
                    sx={{
                        width: { xs: "100%", sm: 500 }
                    }}
                    margin="normal"
                    multiline
                    minRows={3}
                /><br />
                <TextField id="purpose" label="Purpose" variant="outlined"
                    value={club.purpose}
                    onChange={(e) => {
                        handleChange("purpose", e.target.value);
                        setClub({ ...club, purpose: e.target.value });
                    }}
                    helperText={club.purpose === "" && formik.errors.purpose}
                    sx={{
                        width: { xs: "100%", sm: 500 }
                    }}
                    margin="normal"
                /><br />
                <TextField id="member_fees" label="Member Fees" variant="outlined"
                    type="number"
                    value={club.member_fees}
                    onChange={(e) => {
                        handleChange("member_fees", e.target.value);
                        setClub({ ...club, member_fees: e.target.value });
                    }}
                    helperText={club.member_fees === "" && formik.errors.member_fees}
                    sx={{
                        width: { xs: "100%", sm: 500 }
                    }}
                    margin="normal"
                /><br />
                <TextField id="founded_date" label="Founded Date" variant="outlined"
                    type="date"
                    value={club.founded_date}
                    onChange={(e) => {
                        handleChange("founded_date", e.target.value);
                        setClub({ ...club, founded_date: e.target.value });
                    }}
                    helperText={club.founded_date === "" && formik.errors.founded_date}
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
                    value={club.phone_number}
                    onChange={(e) => {
                        handleChange("phone_number", e.target.value);
                        setClub({ ...club, phone_number: e.target.value });
                    }}
                    helperText={club.phone_number === "" && formik.errors.phone_number}
                    sx={{
                        width: { xs: "100%", sm: 500 }
                    }}
                    margin="normal"
                /><br />
                <TextField id="email" label="Email" variant="outlined"
                    type="email"
                    value={club.email}
                    onChange={(e) => {
                        handleChange("email", e.target.value);
                        setClub({ ...club, email: e.target.value });
                    }}
                    helperText={club.email === "" && formik.errors.email}
                    sx={{
                        width: { xs: "100%", sm: 500 }
                    }}
                    margin="normal"
                /><br />
                <Button type="submit" variant="contained" sx={{ color: "light.main", mt: 2, mb: 3.5 }}>Edit</Button>
            </form>
        </>
    )
}