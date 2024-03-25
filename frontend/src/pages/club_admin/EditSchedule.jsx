import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { update } from "../../features/schedule/scheduleSlice";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Button, TextField, Typography } from "@mui/material";

const validateSchema = Yup.object().shape({
    description: Yup.string().required("Description is required."),
    location: Yup.string().required("Location is required."),
});

export default function EditSchedule() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const initialValues = {
        description: "",
        start_date_time: "",
        end_date_time: "",
        location: "",
    };
    const [schedule, setSchedule] = useState(initialValues);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "club_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        (async () => {
            const api = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/api/schedules/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data } = await res.json();
            setSchedule(data[0].schedules);
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
            <Typography color="primary" component="h1" variant="h5">Edit Schedule</Typography>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    const { description, start_date_time, end_date_time, location } = schedule;
                    if (!description || !start_date_time || !end_date_time || !location) return false;
                    if (new Date(start_date_time).getTime() >= new Date(end_date_time).getTime()) return false;

                    dispatch(update({
                        _id: id,
                        description,
                        start_date_time: format(start_date_time, "hh:mm:ss a, MMM d, y"),
                        end_date_time: format(end_date_time, "hh:mm:ss a, MMM d, y"),
                        location
                    }));
                    navigate(`/club_admin/club/schedules`);
                }}>
                <TextField id="description" label="Description" variant="outlined"
                    value={schedule.description}
                    onChange={(e) => {
                        handleChange("description", e.target.value);
                        setSchedule({ ...schedule, description: e.target.value });
                    }}
                    helperText={schedule.description === "" && formik.errors.description}
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
                        value={new Date(schedule.start_date_time)}
                        onChange={(newValue) => {
                            handleChange("start_date_time", newValue);
                            setSchedule({ ...schedule, start_date_time: newValue });
                        }}
                        sx={{
                            width: { xs: "100%", sm: 500 }
                        }}
                    />
                    <DateTimePicker
                        label="End Date Time"
                        disablePast
                        views={["year", "month", "day", "hours", "minutes"]}
                        value={new Date(schedule.end_date_time)}
                        onChange={(newValue) => {
                            handleChange("end_date_time", newValue);
                            setSchedule({ ...schedule, end_date_time: newValue });
                        }}
                        sx={{
                            width: { xs: "100%", sm: 500 }
                        }}
                    />
                </DemoContainer>
                <TextField id="location" label="Location" variant="outlined"
                    value={schedule.location}
                    onChange={(e) => {
                        handleChange("location", e.target.value);
                        setSchedule({ ...schedule, location: e.target.value });
                    }}
                    helperText={schedule.location === "" && formik.errors.location}
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