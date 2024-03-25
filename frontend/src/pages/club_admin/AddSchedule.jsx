import { useRef, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { add } from "../../features/schedule/scheduleSlice";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Button, TextField, Typography } from "@mui/material";

const validateSchema = Yup.object().shape({
    description: Yup.string().required("Description is required."),
    location: Yup.string().required("Location is required."),
});

export default function AddSchedule() {
    const descriptionRef = useRef();
    const startDateTimeRef = useRef();
    const endDateTimeRef = useRef();
    const locationRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "club_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            description: "",
            start_date_time: new Date(),
            end_date_time: new Date(),
            location: "",
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
            <Typography color="primary" component="h1" variant="h5">Add Schedule</Typography>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    const description = descriptionRef.current.value;
                    const start_date_time = startDateTimeRef.current.value;
                    const end_date_time = endDateTimeRef.current.value;
                    const location = locationRef.current.value;

                    if (!description || !start_date_time || !end_date_time || !location) return false;
                    if (new Date(start_date_time).getTime() < new Date().getTime()) return false;
                    if (new Date(end_date_time).getTime() < new Date().getTime()) return false;
                    if (new Date(start_date_time).getTime() >= new Date(end_date_time).getTime()) return false;

                    dispatch(add({
                        description,
                        start_date_time: format(start_date_time, "hh:mm:ss a, MMM d, y"),
                        end_date_time: format(end_date_time, "hh:mm:ss a, MMM d, y"),
                        location
                    }));
                    navigate(`/club_admin/club/schedules`);
                }}>
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
                <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
                    <DateTimePicker
                        label="Start Date Time"
                        disablePast
                        views={["year", "month", "day", "hours", "minutes"]}
                        inputRef={startDateTimeRef}
                        value={formik.values.start_date_time}
                        onChange={(newValue) => handleChange("start_date_time", newValue)}
                        sx={{
                            width: { xs: "100%", sm: 500 }
                        }}
                    />
                    <DateTimePicker
                        label="End Date Time"
                        disablePast
                        views={["year", "month", "day", "hours", "minutes"]}
                        inputRef={endDateTimeRef}
                        value={formik.values.end_date_time}
                        onChange={(newValue) => handleChange("end_date_time", newValue)}
                        sx={{
                            width: { xs: "100%", sm: 500 }
                        }}
                    />
                </DemoContainer>
                <TextField id="location" label="Location" variant="outlined"
                    inputRef={locationRef}
                    value={formik.values.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    helperText={formik.errors.location}
                    sx={{
                        width: { xs: "100%", sm: 500 }
                    }}
                    margin="normal"
                    multiline
                    minRows={3}
                /><br />
                <Button type="submit" variant="contained" sx={{ color: "light.main", mt: 2, mb: 3.5 }}>Add</Button>
            </form>
        </>
    )
}